const FilterSortBar = ({ sort, setSort }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
    <div className="flex flex-wrap gap-4">
      <select className="p-2 border rounded" defaultValue="">
        <option value="">Tất cả thương hiệu</option>
        <option value="elmich">Elmich</option>
        <option value="sunhouse">Sunhouse</option>
      </select>
      <select className="p-2 border rounded" defaultValue="">
        <option value="">Loại sản phẩm</option>
        <option value="noi">Nồi</option>
        <option value="chao">Chảo</option>
      </select>
      <select className="p-2 border rounded" defaultValue="">
        <option value="">Khoảng giá</option>
        <option value="1">Dưới 500k</option>
        <option value="2">500k - 1tr</option>
        <option value="3">Trên 1tr</option>
      </select>
    </div>
    <select className="p-2 border rounded" value={sort} onChange={(e) => setSort(e.target.value)}>
      <option value="popular">Phổ biến</option>
      <option value="new">Mới nhất</option>
      <option value="priceAsc">Giá tăng dần</option>
      <option value="priceDesc">Giá giảm dần</option>
    </select>
  </div>
);

export default FilterSortBar;
