export default function CategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide px-4 gap-2 py-3">
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
                transition-colors duration-150 min-h-[44px] whitespace-nowrap
                ${
                  isActive
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300"
                }
              `}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
