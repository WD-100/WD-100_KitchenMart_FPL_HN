import { ShoppingCartIcon } from '@heroicons/react/24/solid';

const ProductCard = ({ product }) => (
  <div className="border rounded-lg p-2 shadow hover:shadow-md transition">
    <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
    <h3 className="mt-2 font-semibold text-sm md:text-base line-clamp-2">{product.name}</h3>
    <p className="text-red-500 font-bold mt-1">{product.price.toLocaleString()}₫</p>

    <button className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded shadow-md flex items-center justify-center gap-2 transition duration-300">
      Mua ngay
    </button>

    <button className="mt-2 w-full bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded shadow-md flex items-center justify-center gap-2 transition duration-300">
      <ShoppingCartIcon className="w-5 h-5" />
      Thêm vào giỏ hàng
    </button>
  </div>
);

export default ProductCard;
