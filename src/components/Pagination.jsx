const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center gap-2 mt-8">
    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => onPageChange(i + 1)}
        className={`px-3 py-1 rounded border transition ${
          currentPage === i + 1
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-green-700 border-green-300 hover:bg-green-100'
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
);

export default Pagination;
