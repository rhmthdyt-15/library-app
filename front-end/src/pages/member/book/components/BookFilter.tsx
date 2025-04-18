import React, { useState, useEffect } from "react";
import { Category } from "../../../../services/category/interface";

interface BookFilterProps {
  categories: Category[];
  onFilterChange: (filters: {
    title?: string;
    author?: string;
    category_id?: number;
  }) => void;
  loading?: boolean;
  categoriesLoading?: boolean;
}

const BookFilter: React.FC<BookFilterProps> = ({
  categories,
  onFilterChange,
  loading = false,
  categoriesLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const filters: {
      title?: string;
      author?: string;
      category_id?: number;
    } = {};

    if (title.trim()) filters.title = title;
    if (author.trim()) filters.author = author;
    if (categoryId !== undefined) filters.category_id = categoryId;

    onFilterChange(filters);
  }, [title, author, categoryId]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Buku</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Judul
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Cari judul buku..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Penulis
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Cari penulis..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kategori
          </label>
          <select
            id="category"
            value={categoryId ?? ""}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || categoriesLoading}
          >
            <option value="">Semua Kategori</option>
            {categoriesLoading ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BookFilter;
