import bgImage from '../assets/background.png';

export default function Register() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="backdrop-blur-sm bg-white/90 max-w-md w-full p-8 rounded-2xl shadow-2xl">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Đăng ký tài khoản
        </h2>

        {/* Form đăng ký */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition duration-200 font-semibold"
          >
            Đăng ký
          </button>
        </form>

        {/* Liên kết đăng nhập */}
        <p className="mt-4 text-sm text-center text-gray-700">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-green-600 hover:underline font-medium"
          >
            Đăng nhập
          </a>
        </p>

        {/* Quay về trang chủ */}
        <div className="mt-4 text-center">
          <a
            href="/"
            className="inline-block text-sm text-gray-600 hover:text-green-500 transition"
          >
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
