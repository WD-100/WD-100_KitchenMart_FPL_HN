const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center gap-2 mt-8">
    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => onPageChange(i + 1)}
        className={`px-3 py-1 rounded border ${
          currentPage === i + 1 ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
);

export default Pagination;
