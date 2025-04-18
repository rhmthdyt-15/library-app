// src/components/dashboard/PopularBooks.tsx
import React from "react";
import { Book } from "../../../../services/reports/interface";
import { getImageUrl } from "../../../../utils/url";

interface PopularBooksProps {
  books: Book[];
}

export const PopularBooks: React.FC<PopularBooksProps> = ({ books }) => {
  if (books.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Buku Populer</h3>
        <p className="text-gray-500">Belum ada data buku populer.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Buku Populer</h3>
      <div className="space-y-4">
        {books.map((book) => (
          <div key={book.id} className="flex items-start space-x-4">
            {book.cover_image ? (
              <img
                src={getImageUrl(book.cover_image)}
                alt={book.title}
                className="w-16 h-20 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-20 bg-gray-200 flex items-center justify-center rounded">
                <span className="text-gray-400">No Cover</span>
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-800">{book.title}</h4>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-xs text-gray-500 mt-1">
                Dipinjam {book.borrowings_count || 0} kali
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
