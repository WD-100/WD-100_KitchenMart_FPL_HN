import { create } from "zustand";
import orderService from "../Service/OrderService";

const useOrderStore = create((set) => ({
    order: {},
    orderItems: [],
    orderHistories: [],
    loading: false,

    // Lấy chi tiết đơn hàng
    fetchOrder: async (id) => {
        set({ loading: true });
        try {
            const res = await orderService.detailOrder(id);
            set({
                order: res.data.data,
                orderItems: res.data.data.order_items || [],
            });
        } catch (err) {
            console.error("fetchOrder error:", err);
        } finally {
            set({ loading: false });
        }
    },

    // Lấy lịch sử đơn hàng
    fetchOrderHistories: async (id) => {
        try {
            const res = await orderService.listOrderHistories(id);
            set({ orderHistories: res.data.data || [] });
        } catch (err) {
            console.error("fetchOrderHistories error:", err);
        }
    },

    // Hủy đơn hàng (User/Admin đều dùng được)
    cancelOrder: async (id, reason) => {
        try {
            await orderService.cancelOrder(id, { reason_cancel: reason });
            await Promise.all([
                useOrderStore.getState().fetchOrder(id),
                useOrderStore.getState().fetchOrderHistories(id),
            ]);
        } catch (err) {
            console.error("cancelOrder error:", err);
            throw err;
        }
    },

    // Cập nhật trạng thái đơn hàng (Admin)
    updateOrderStatus: async (id, payload) => {
        try {
            await orderService.adminUpdateOrder(id, payload);
            await Promise.all([
                useOrderStore.getState().fetchOrder(id),
                useOrderStore.getState().fetchOrderHistories(id),
            ]);
        } catch (err) {
            console.error("updateOrderStatus error:", err);
            throw err;
        }
    },
}));

export default useOrderStore;
