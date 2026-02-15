type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pagesToShow = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  ).filter((page) => page >= currentPage - 2 && page <= currentPage + 2);

  return (
    <div className="flex justify-center gap-2 my-4">
      {pagesToShow.map((page) => (
        <button
          key={page}
          className={`px-3 py-2 rounded text-xs font-normal cursor-pointer ${
            currentPage === page
              ? "bg-[#1d2087] text-white"
              : "bg-white text-black"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
