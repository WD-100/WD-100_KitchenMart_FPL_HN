import bgImage from '../assets/background.png'; 

export default function Login() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="backdrop-blur-sm bg-white/80 max-w-md w-full p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Đăng nhập</h2>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Đăng nhập
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-red-500 hover:underline">
            Đăng ký ngay
          </a>
        </p>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="inline-block text-sm text-gray-600 hover:text-red-500 transition"
          >
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
