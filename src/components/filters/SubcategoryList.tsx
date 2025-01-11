
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useCategory } from "../../hooks/useCategory"; // Import the useCategory hook
import { useTranslation } from "react-i18next";

interface SubcategoryListProps {
  categoryId?: string;
  activeSubcategoryId?: string;
}

const SubcategoryList: React.FC<SubcategoryListProps> = () => {
  const location = useLocation(); // Use useLocation to get the current URL
  const { t } = useTranslation(); // Use translation hook
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>(
    {}
  );
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<number | null>(
    null
  );

  // Use the useCategory hook
  const { categories, isLoading, error, hasMore, loadMore } = useCategory();

  useEffect(() => {
    const urlParts = location.pathname.split("/");
    const lastSegment = urlParts[urlParts.length - 1];
    const isSubcategory = urlParts[urlParts.length - 2] === "subcategory";

    if (isSubcategory) {
      setActiveSubcategoryId(parseInt(lastSegment));
      const activeCategory = categories.find((category) =>
        category.subcategories.some(
          (subcategory) => subcategory.id === parseInt(lastSegment)
        )
      );
      if (activeCategory) {
        setActiveCategoryId(activeCategory.id);
        setOpenCategories((prev) => ({ ...prev, [activeCategory.id]: true }));
      }
    } else {
      setActiveCategoryId(parseInt(lastSegment));
    }
  }, [categories, location.pathname]); // Use location.pathname instead of routeId

  const toggleCategory = (categoryId: number) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4 ml-4" />
            <div className="h-4 bg-gray-100 rounded w-3/4 ml-4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (categories.length === 0) {
    return <div className="text-gray-500 text-sm">{t("no_categories_available")}</div>;
  }

  return (
    <div className="space-y-2">
      {categories
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((category) => (
          <div
            key={category.id}
            className="border-b rounded-md overflow-hidden"
          >
            <div
              className={`flex items-center justify-between ${
                category.id === activeCategoryId
                  ? "bg-[#e7a334] text-white font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Link
                to={`/category/${category.id}`}
                className={`flex-1 px-3 py-2`}
              >
                <span className="flex items-center justify-between">
                  <span>{category.name}</span>
                </span>
              </Link>
              {category.subcategories.length > 0 && (
                <button
                  className="px-3 py-2 text-gray-500"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation
                    toggleCategory(category.id);
                  }}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openCategories[category.id] ? "rotate-180" : ""
                    } ${
                      category.id === activeCategoryId ? "text-white" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {openCategories[category.id] &&
              category.subcategories.length > 0 && (
                <div className="bg-gray-50 border-t">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      to={`/subcategory/${subcategory.id}`}
                      className={`block px-4 py-2 text-sm ${
                        subcategory.id === activeSubcategoryId
                          ? "bg-[#e7a334] text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span>{subcategory.name}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full text-center text-sm text-[#e7a334] hover:text-[#fed874]"
        >
          {t("load_more")}
        </button>
      )}
    </div>
  );
};

export default SubcategoryList;