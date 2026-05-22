import React from "react";

export default function PaginationControls({
  page,
  totalPages,
  isLoading,
  onPageSelect,
  onPrevious,
  onNext,
}) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const visiblePages = [];

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    if (
      pageIndex === 0 ||
      pageIndex === totalPages - 1 ||
      Math.abs(pageIndex - page) <= 1
    ) {
      visiblePages.push(pageIndex);
    }
  }

  const pageItems = [];

  visiblePages.forEach((pageIndex, index) => {
    pageItems.push(
      <button
        key={pageIndex}
        type="button"
        className={`pagination-page-button ${pageIndex === page ? "is-active" : ""}`}
        onClick={() => onPageSelect(pageIndex)}
        disabled={isLoading || pageIndex === page}
      >
        {pageIndex + 1}
      </button>,
    );

    const nextPageIndex = visiblePages[index + 1];

    if (nextPageIndex && nextPageIndex - pageIndex > 1) {
      pageItems.push(
        <span key={`ellipsis-${pageIndex}`} className="pagination-ellipsis">
          ...
        </span>,
      );
    }
  });

  return (
    <div className="pagination-controls">
      <button
        type="button"
        className="pagination-arrow-button"
        onClick={onPrevious}
        disabled={isLoading || page <= 0}
        aria-label="Previous page"
      >
        &lt;
      </button>
      <div className="pagination-pages">{pageItems}</div>
      <button
        type="button"
        className="pagination-arrow-button"
        onClick={onNext}
        disabled={isLoading || page >= totalPages - 1}
        aria-label="Next page"
      >
        &gt;
      </button>
    </div>
  );
}
