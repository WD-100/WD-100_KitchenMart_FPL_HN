import React from 'react';

const ContactPage = () => {
  return (
    <div className="p-6 mx-auto font-sans max-w-7xl">
      <h1 className="mb-4 text-2xl font-bold text-green-600">Liên hệ</h1>

      <div className="flex flex-col gap-8 mb-10 md:flex-row">
        {/* Left: Info + Form */}
        <div className="flex-1">
          <p><strong>KitchenMart:</strong> U Hrubku 1570 Ostrava Nova Ves 70900, Czech Republic</p>
          <p><strong>Văn phòng Việt Nam:</strong> 63 Lê Văn Lương, Trung Hòa, Cầu Giấy, Hà Nội</p>
          <p><strong>Email:</strong> cskh@elmich.vn</p>
          <p><strong>Hotline:</strong> 1900 6369 25</p>
          <p><strong>Mã số thuế:</strong> 0700525789</p>

          <form className="mt-4 space-y-3">
            <input className="w-full p-2 border" type="text" placeholder="Tên *" required />
            <input className="w-full p-2 border" type="email" placeholder="Địa chỉ email *" required />
            <textarea className="w-full p-2 border" rows="4" placeholder="Nội dung *" required></textarea>
            <p className="text-sm text-gray-600">* Thông tin bắt buộc</p>
            <button className="px-4 py-2 text-white bg-green-600" type="submit">Gửi liên hệ</button>
          </form>
        </div>

        {/* Right: Map */}
        <div className="flex-1">
          <iframe
            title="KitchenMart Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.620067780353!2d105.80284257504374!3d21.008487688482252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5ad5f66dcb%3A0xd07d47df8a0b0d93!2zNjMgxJAuIEzDqiBWxINuIEx1w6puZywgVHJ1bmcgSMOyYSwgQ-G7lSBHaeG6pXksIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1700000000000"
            className="w-full border-0 h-72"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="grid grid-cols-1 gap-6 pt-6 text-sm text-gray-700 border-t md:grid-cols-4">
        <div>
          <h1 className="text-2xl font-bold text-green-600">KitchenMart</h1>
          <p><strong>KitchenMart:</strong> U Hrubku 1570 Ostrava Nova Ves 70900</p>
          <p><strong>VP Việt Nam:</strong> 63 Lê Văn Lương, Hà Nội</p>
          <p><strong>Email:</strong> cskh@kitchenmart.vn</p>
          <p><strong>Hotline:</strong> 1900 6369 25</p>
          <p><strong>MST:</strong> 0700525789</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Hướng dẫn - Chính sách</h3>
          <ul className="space-y-1">
            <li>Hướng dẫn mua hàng</li>
            <li>Chính sách bảo hành</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách giao hàng</li>
            <li>Chính sách thanh toán</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách trả góp 0%</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Liên hệ - Giới thiệu</h3>
          <ul className="space-y-1">
            <li>Giới thiệu về KitchenMart</li>
            <li>Chứng nhận sản phẩm</li>
            <li>Liên hệ - Hỗ trợ</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Kết nối với chúng tôi</h3>
          <div className="flex mb-2 space-x-2">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" />
            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046125.png" alt="TikTok" width="24" />
            <img src="https://cdn-icons-png.flaticon.com/512/733/733646.png" alt="YouTube" width="24" />
          </div>
          <p>Phương thức thanh toán:</p>
           <div className="flex flex-wrap gap-2 mt-2">
            <img src="https://tse4.mm.bing.net/th?id=OIP.dPjj0RmGu4qQ7Rlp8wcSYAHaHa&pid=Api&P=0&h=180" width="50" alt="VNPAY" />
            <img src="https://tse3.mm.bing.net/th?id=OIP.z3_kIplVVw5bsiuAf1HY-gHaHa&pid=Api&P=0&h=180" width="50" alt="Visa" />
            <img src="https://tse3.mm.bing.net/th?id=OIP.Go89l5b39t1qo4Wt-B1QBAAAAA&pid=Api&P=0&h=180" width="50" alt="Mastercard" />
            <img src="https://tse1.mm.bing.net/th?id=OIP.JWsl39NXvjcGkxk3H3aB8wHaCz&pid=Api&P=0&h=180" width="100" alt="Đã thông báo" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;

