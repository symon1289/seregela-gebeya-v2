import React, { useState } from "react";
import { ChevronDown, RotateCcw, X } from "lucide-react";
import SortFilter, { SortOption } from "./SortFilter";
import SubcategoryList from "./SubcategoryList";
import PriceFilter from "./PriceFilter";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  sortBy: SortOption["value"];
  onSortChange: (value: SortOption["value"]) => void;
  showAllCategories?: boolean;
}

const defaultSortOptions: SortOption[] = [
  { value: "created_at", label: "Latest" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  minPrice,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
}) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    sort: true,
  });

  const { t } = useTranslation();
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleClearFilters = () => {
    onPriceChange(0, 100000);
    onSortChange("created_at");
  };

  const hasActiveFilters =
    minPrice > 0 || maxPrice < 100000 || sortBy !== "created_at";

  return (
    <>
      {/* Menu Button for sm and md screens */}
      <button
        onClick={() => onClose()}
        className={`fixed left-2 top-1/2 transform -translate-y-1/2 p-2.5 bg-primary hover:bg-secondary rounded-full text-white lg:hidden z-40 shadow-lg flex items-center gap-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
          !isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <ChevronDown className="w-6 h-6 transform rotate-[-90deg]" />
        <span className="hidden md:inline text-sm font-medium pr-1">
          {t("filters")}
        </span>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky lg:top-4 inset-y-0 left-0 z-50 w-[280px] sm:w-[280px] md:w-[300px] lg:w-[300px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } h-screen lg:h-[calc(100vh-2rem)] overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("filters")}
            </h2>
            <button
              onClick={onClose}
              className="p-2.5 bg-primary hover:bg-secondary rounded-full text-white lg:hidden transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center text-sm text-primary hover:text-secondary transition-colors duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                {t("clear_filters")}
              </button>
            )}

            <div>
              <button
                className="flex justify-between items-center py-2 w-full"
                onClick={() => toggleSection("categories")}
              >
                <span className="font-medium">Categories</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openSections.categories ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.categories && (
                <div className="mt-2">
                  <SubcategoryList />
                </div>
              )}
            </div>

            <div>
              <button
                className="flex justify-between items-center py-2 w-full"
                onClick={() => toggleSection("price")}
              >
                <span className="font-medium">{t("price_range")}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openSections.price ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.price && (
                <div className="mt-2">
                  <PriceFilter
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceChange={onPriceChange}
                  />
                </div>
              )}
            </div>

            <div>
              <button
                className="flex justify-between items-center py-2 w-full"
                onClick={() => toggleSection("sort")}
              >
                <span className="font-medium">{t("sortby")}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openSections.sort ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.sort && (
                <div className="mt-2">
                  <SortFilter
                    options={defaultSortOptions}
                    sortBy={sortBy}
                    onSortChange={onSortChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
