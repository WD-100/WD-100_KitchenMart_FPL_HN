const Header = () => {
  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-white shadow">
        <div className="flex items-center justify-between max-w-screen-xl px-4 py-4 mx-auto">
          <a href="/" className="text-gray-700 hover:text-green-500">
            <h1 className="text-2xl font-bold text-green-600">KitchenMart</h1>
          </a>

          <nav className="space-x-6">
            <a href="/products" className="text-gray-700 hover:text-green-500">
              Sản phẩm
            </a>
            <a href="/blog" className="text-gray-700 hover:text-green-500">
              Bài viết
            </a>
            <a href="/contact" className="text-gray-700 hover:text-green-500">
              Liên hệ
            </a>
            <a href="/register" className="text-gray-700 hover:text-green-500">
              Tài khoản
            </a>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px]" />
    </>
  );
};

export default Header;
