import React, { useState } from "react";

type DataTableProps<T extends object> = {
  data: T[];
  rowsPerPage?: number;
};

function DataTable<T extends object>({ data, rowsPerPage = 5 }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  // Get headers from object keys
  const headers = Object.keys(data[0]) as (keyof T)[];

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedData = data.slice(startIndex, startIndex + rowsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="">
      <div className="overflow-x-auto ">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              {headers.map((key) => (
                <th key={String(key)} className="px-6 py-3">{String(key)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedData.map((row, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition"
              >
                {headers.map((key) => (
                  <td key={String(key)} className="px-6 py-4">
                    {String(row[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataTable;