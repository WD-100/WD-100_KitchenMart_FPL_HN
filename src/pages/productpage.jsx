import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import FilterSortBar from '../components/FilterSortBar';
import Pagination from '../components/Pagination';

const productsMock = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  name: `Sản phẩm ${i + 1}`,
  price: 100000 * (i + 1),
  image: 'https://via.placeholder.com/200x200',
}));

const ProductListPage = () => {
  const [sort, setSort] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sắp xếp sản phẩm dựa trên lựa chọn sort
  const sortedProducts = [...productsMock].sort((a, b) => {
    if (sort === 'priceAsc') return a.price - b.price;
    if (sort === 'priceDesc') return b.price - a.price;
    return 0; // popular hoặc mặc định không sắp xếp
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Lấy sản phẩm cho trang hiện tại
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-white text-gray-800">
      <Breadcrumb current="Nồi chảo" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-green-700">Danh sách sản phẩm</h2>
        <FilterSortBar sort={sort} setSort={setSort} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg shadow hover:shadow-lg transition duration-200 p-4 flex flex-col items-center text-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="object-contain h-32 mb-4"
            />
            <h3 className="text-sm font-medium text-gray-700">{product.name}</h3>
            <p className="mt-2 text-green-600 font-semibold">
              {product.price.toLocaleString()}₫
            </p>
            <button className="mt-3 px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProductListPage;
