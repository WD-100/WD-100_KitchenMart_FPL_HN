import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import FilterSortBar from '../components/FilterSortBar';
import ProductCard from '../components/ProductCard';
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

  const sortedProducts = [...productsMock].sort((a, b) => {
    if (sort === 'priceAsc') return a.price - b.price;
    if (sort === 'priceDesc') return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <Breadcrumb current="Nồi chảo" />
      <FilterSortBar sort={sort} setSort={setSort} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default ProductListPage;
