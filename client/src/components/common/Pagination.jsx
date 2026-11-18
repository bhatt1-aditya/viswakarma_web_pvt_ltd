import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex px-4 items-center justify-between my-4 flex-wrap gap-2">

            {/* Left Info */}
            <p className="text-xs text-gray-500">
                Page {page} of {totalPages}
            </p>

            {/* Controls */}
            <div className="flex items-center gap-1">

                {/* Prev */}
                <button
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className={`px-3 py-1 text-xs rounded border ${page === 1
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100 text-gray-600"
                        }`}
                >
                    Prev
                </button>

                {/* FIRST */}
                <button
                    onClick={() => onPageChange(1)}
                    className={`px-3 py-1 text-xs rounded border ${page === 1
                            ? "bg-gray-900 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    1
                </button>

                {/* LEFT DOT */}
                {page > 3 && (
                    <span className="px-2 text-gray-400 text-xs">...</span>
                )}

                {/* CURRENT */}
                {page !== 1 && page !== totalPages && (
                    <button className="px-3 py-1 text-xs rounded border bg-gray-900 text-white">
                        {page}
                    </button>
                )}

                {/* RIGHT DOT */}
                {page < totalPages - 2 && (
                    <span className="px-2 text-gray-400 text-xs">...</span>
                )}

                {/* LAST */}
                {totalPages > 1 && (
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`px-3 py-1 text-xs rounded border ${page === totalPages
                                ? "bg-gray-900 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {totalPages}
                    </button>
                )}

                {/* Next */}
                <button
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className={`px-3 py-1 text-xs rounded border ${page === totalPages
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100 text-gray-600"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;