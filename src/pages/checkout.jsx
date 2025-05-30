import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/order-confirmation/ORD' + Math.floor(Math.random() * 1000000));
  };

  return (
    <div className="bg-white min-h-screen">
      <header className="py-4 flex justify-center border-b">
        <img src="" alt="Elmich Logo" className="h-14" />
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex mb-4">
                <div className="flex-1 flex items-center">
                  <h2 className="text-lg font-medium">Thông tin nhận hàng</h2>
                </div>
                <div className="flex items-center text-blue-500">
                  <button type="button" className="flex items-center text-sm">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                    </svg>
                    Đăng nhập
                  </button>
                </div>
              </div>
              {/* Form fields */}
              <div className="mb-6">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
                <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
                <div className="flex mb-4">
                  <div className="w-12 flex items-center justify-center bg-white border border-r-0 rounded-l">
                    <span className="text-sm">+84</span>
                  </div>
                  <input type="tel" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} className="flex-1 p-2 border rounded-r" required />
                </div>
                <input type="text" name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
                <select name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded mb-4" required>
                  <option value="">Tỉnh/thành</option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hochiminh">TP. Hồ Chí Minh</option>
                  <option value="thanhhoa">Thanh Hóa</option>
                </select>
                <select name="district" value={formData.district} onChange={handleChange} className="w-full p-2 border rounded mb-4" required>
                  <option value="">Quận/huyện</option>
                  <option value="district1">Quận 1</option>
                  <option value="district2">Quận 2</option>
                </select>
                <select name="ward" value={formData.ward} onChange={handleChange} className="w-full p-2 border rounded mb-4" required>
                  <option value="">Phường/xã</option>
                  <option value="ward1">Phường 1</option>
                  <option value="ward2">Phường 2</option>
                </select>
                <textarea name="notes" rows={3} placeholder="Ghi chú (tùy chọn)" value={formData.notes} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>

              {/* Thanh toán */}
              <div>
                <h2 className="text-lg font-medium mb-4">Thanh toán</h2>
                {['vnpay-qr', 'onepay-visa', 'onepay-atm', 'vnpay-online', 'cod'].map((method) => (
                  <div key={method} className="border rounded p-4 cursor-pointer mb-4" onClick={() => handlePaymentMethodChange(method)}>
                    <div className="flex items-center">
                      <input type="radio" id={method} name="payment" checked={paymentMethod === method} onChange={() => handlePaymentMethodChange(method)} className="h-4 w-4 mr-3" />
                      <label htmlFor={method} className="flex-1 cursor-pointer capitalize">{method.replace(/-/g, ' ')}</label>
                      <div className="w-20">
                        <img src="" alt={method} className="h-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded p-4">
                <h2 className="text-lg font-medium border-b pb-4 mb-4">Đơn hàng (1 sản phẩm)</h2>
                <div className="flex items-start mb-4">
                  <img src="" alt="Sản phẩm" className="w-16 h-16 object-cover border rounded mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">Bộ sản phẩm chăm sóc bé Elmich Baby</h3>
                    <p className="text-xs text-gray-500 mt-1">Vàng nhạt</p>
                    <p className="text-sm mt-1">450,000đ</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  <input type="text" placeholder="Nhập mã giảm giá" className="flex-1 p-2 border rounded-l border-r-0" />
                  <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600">Áp dụng</button>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Tạm tính</span>
                    <span className="text-sm">450,000đ</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm">Phí vận chuyển</span>
                    <span className="text-sm">0đ</span>
                  </div>
                  <div className="flex justify-between font-medium mb-4">
                    <span>Tổng cộng</span>
                    <span className="text-xl text-red-500">450,000đ</span>
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 mb-4">ĐẶT HÀNG</button>
                  <p className="text-xs text-gray-500 text-center mb-4">Quý khách có thể xuất hóa đơn với tổng đơn hàng từ 200.000đ...</p>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Liên hệ hỗ trợ đặt hàng:</p>
                    <p className="font-medium text-sm text-red-500">0901870440</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <footer className="border-t mt-8 py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-2 text-center">
            <a href="#" className="text-blue-500 mx-2">Chính sách hoàn tiền</a>
            <a href="#" className="text-blue-500 mx-2">Chính sách bảo mật</a>
            <a href="#" className="text-blue-500 mx-2">Điều khoản sử dụng</a>
          </div>
          <p>Quý khách có nhu cầu xuất hóa đơn vui lòng để lại thông tin tại mục ghi chú...</p>
          <p className="mt-2">Liên hệ hỗ trợ đặt hàng: <span className="text-red-500 font-medium">0901870440</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
