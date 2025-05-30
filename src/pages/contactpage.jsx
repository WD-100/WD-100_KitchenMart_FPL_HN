import React from 'react';

const ContactPage = () => {
  return (
    <div className="p-6 mx-auto font-sans max-w-7xl">
      {/* Tiêu đề trang */}
      <h1 className="mb-4 text-2xl font-bold text-green-600">Liên hệ</h1>

      <div className="flex flex-col gap-8 mb-10 md:flex-row">
        {/* Left: Thông tin liên hệ và form */}
        <div className="flex-1">
          <p>
            <strong>KitchenMart:</strong> U Hrubku 1570 Ostrava Nova Ves 70900, Czech Republic
          </p>
          <p>
            <strong>Văn phòng Việt Nam:</strong> 63 Lê Văn Lương, Trung Hòa, Cầu Giấy, Hà Nội
          </p>
          <p>
            <strong>Email:</strong> cskh@kitchenmart.vn
          </p>
          <p>
            <strong>Hotline:</strong> 1900 6369 25
          </p>
          <p>
            <strong>Mã số thuế:</strong> 0700525789
          </p>

          <form className="mt-4 space-y-3">
            <input
              className="w-full p-2 border"
              type="text"
              placeholder="Tên *"
              required
            />
            <input
              className="w-full p-2 border"
              type="email"
              placeholder="Địa chỉ email *"
              required
            />
            <textarea
              className="w-full p-2 border"
              rows="4"
              placeholder="Nội dung *"
              required
            ></textarea>
            <p className="text-sm text-gray-600">* Thông tin bắt buộc</p>
            <button
              className="px-4 py-2 text-white bg-green-600"
              type="submit"
            >
              Gửi liên hệ
            </button>
          </form>
        </div>

        {/* Right: Bản đồ */}
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
    </div>
  );
};

export default ContactPage;
