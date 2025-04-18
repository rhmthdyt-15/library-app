interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
  onPageChange: (page: number) => void;
}

const Pagination = ({ links, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="flex space-x-1">
          {links.map((link, index) => (
            <li key={index}>
              <button
                className={`px-3 py-1 rounded ${
                  link.active ? "bg-blue-500 text-white" : "bg-gray-200"
                } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (link.url) {
                    const pageMatch = link.url.match(/page=(\d+)/);
                    if (pageMatch && pageMatch[1]) {
                      onPageChange(parseInt(pageMatch[1]));
                    }
                  }
                }}
                disabled={!link.url}
              >
                <span dangerouslySetInnerHTML={{ __html: link.label }} />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
