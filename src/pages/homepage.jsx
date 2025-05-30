import React from "react";

export default function Homepage() {
  return (
    <main className="w-full min-h-screen font-sans text-gray-800 bg-white">
      {/* Navbar */}
      <header className="w-full bg-white shadow fixed top-0 left-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">KitchenMart</h1>
          <nav className="space-x-6">
            <a href="#" className="text-gray-700 hover:text-red-500">
              Sản phẩm
            </a>
            <a href="#" className="text-gray-700 hover:text-red-500">
              Bài viết
            </a>
            <a href="#" className="text-gray-700 hover:text-red-500">
              Liên hệ
            </a>
            <a href="#" className="text-gray-700 hover:text-red-500">
              Tài khoản
            </a>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px]" />

      {/* Hero Section */}
      <section className="relative w-full bg-[url('https://shop.elmich.vn/uploads/Banner/banner-web-2022.png')] bg-cover bg-center h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-white text-center max-w-screen-lg px-4">
          <h2 className="text-4xl font-bold mb-4">
            Chất lượng cao cho gian bếp Việt
          </h2>
          <p className="mb-6 text-lg">
            Khám phá bộ sản phẩm cao cấp của KitchenMart.
          </p>
          <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded">
            Khám phá ngay
          </button>
        </div>
      </section>

      {/* Danh mục sản phẩm */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          DANH MỤC SẢN PHẨM
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 justify-items-center">
          {[
            {name: "Bộ dụng cụ nhà bếp", image: "/src/images/dmsp-bodungcubep.jpg"},
            {name: "Nồi, chảo", image: "/src/images/dmsp-chao.jpg" },
            {name: "Nồi cơm điện", image: "/src/images/dmsp-noicomdien.png" },
            {name: "Nồi chiên không dầu", image: "/src/images/dmsp-noichienkhongdau.png"},
            {name: "Lò vi sóng", image: "/src/images/dmsp-lovisong.png" },
            {name: "Máy hút mùi", image: "/src/images/dmsp-mayhutmui.png" },
            {name: "Máy xay, máy ép", image: "/src/images/dmsp-mayxay.jpg" },
            {name: "Bình/cốc giữ nhiệt", image: "/src/images/dmsp-binhgiunhiet.png"},
            {name: "Ấm siêu tốc", image: "/src/images/dmsp-amsieutoc.png" },
            {name: "Bếp điện, bếp từ", image: "/src/images/dmsp-beptu.png" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="w-[140px] h-[160px] bg-white border rounded-xl shadow hover:shadow-lg transition flex flex-col items-center justify-center text-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-14 object-contain mb-2"
              />
              <p className="text-[13px] font-small text-gray-700 leading-snug text-center">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Giới thiệu */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-screen-md mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Tại sao chọn KitchenMart?
          </h3>
          <p>
            Chúng tôi cung cấp sản phẩm nhà bếp chất lượng cao, thiết kế tinh
            tế, và đảm bảo an toàn sức khỏe cho người dùng Việt.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-600 text-white py-6">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          &copy; {new Date().getFullYear()} WD-100 KitchenMart. All rights
          reserved.
        </div>
      </footer>
    </main>
  );
}
