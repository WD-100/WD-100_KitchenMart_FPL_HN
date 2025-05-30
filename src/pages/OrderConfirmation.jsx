import { Link, useParams } from 'react-router-dom';

const OrderConfirmation = () => {
  const { id } = useParams(); // Không cần định kiểu trong JS

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-custom">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-2">Thành Công</h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ và giao hàng sớm nhất có thể.
          </p>
        </div>

        <div className="border-t border-b py-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Mã Đơn:</span>
            <span className="font-medium">{id || 'ORD-12345'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày Tạo:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Tóm tắt đơn hàng</h2>
          <div className="flex items-center p-4 bg-gray-50 rounded mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
              <img 
                src="/images/sanpham-demo.jpg" 
                alt="Product" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-medium">Bộ sản phẩm chăm sóc bé Elmich Baby</h3>
              <p className="text-sm text-gray-500">Số lượng: 1</p>
            </div>
            <div className="font-medium">
              450,000đ
            </div>
          </div>

          <div className="flex justify-between font-medium">
            <span>Tổng cộng:</span>
            <span>450,000đ</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Link to="/" className="btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
