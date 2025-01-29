import { Link } from "react-router-dom";
import { useCategory } from "../hooks/useCategory";
import { useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
const CategoryGrid: React.FC = () => {
  const { categories, isLoading, error, hasMore, loadMore } = useCategory();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth < container.scrollWidth
      );
    }
  };
  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollability);
      }
    };
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10"
          >
            <ChevronLeft />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10"
          >
            <ChevronRight />
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className="grid auto-cols-[10.5rem] grid-flow-col gap-3 overflow-x-auto"
        >
          {categories
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((category) => (
              <Link
                to={`/seregela-gebeya-v2/category/${category.id}`}
                key={category.id}
                className="flex flex-col items-center group cursor-pointer "
              >
                <div className="group relative bg-white rounded-lg overflow-hidden mb-2 aspect-square w-full">
                  <img
                    src={category.image_path}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 -z-30"
                    loading="lazy"
                  />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {category.name}
                </span>
              </Link>
            ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e9a83a]"></div>
        </div>
      )}
      {!isLoading && hasMore && (
        <button
          onClick={() => loadMore()}
          className="bg-[#e9a83a] hover:bg-[#fed874] text-white transition-colors py-2 px-4 rounded-lg font-semibold"
        >
          Load More
        </button>
      )}
      {!isLoading && !hasMore && (
        // <div className="text-center">
        //   <p className="text-gray-600 text-lg">No more categories to load.</p>
        // </div>
        <div></div>
      )}
    </div>
  );
};

export default CategoryGrid;
