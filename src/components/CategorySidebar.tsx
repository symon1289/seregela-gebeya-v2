import React, { useState } from 'react';
import { Grid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CategoryItems } from './loading skeletons/category/CategorySideBar.tsx';
interface Subcategory {
    id: number;
    name: string;
    name_am: string | null;
    products_count: number;
}

interface Category {
    id: number;
    name: string;
    name_am: string;
    products_count: number;
    subcategories: Subcategory[];
    image_path: string;
}

interface CategoryNavProps {
    categories: Category[];
    isLoading: boolean;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, isLoading }) => {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<number | null>(null);

    return (
        <div className="relative w-full shadow-lg h-[400px] z-[100]">
            <ul className="flex flex-col">
                <li className="py-2 w-full hover:text-[#e9a83a] hover:bg-gray-100">
                    <Link
                        to="/seregela-gebeya-v2/products"
                        className="flex items-center gap-2 hover:text-[#e9a83a] text-sm font-medium ml-4"
                    >
                        <Grid className="w-8 h-8" />
                        <span>{t('allProducts')}</span>
                    </Link>
                </li>

                {/* Categories List */}
                {isLoading
                    ? Array.from({ length: 7 }).map((_, index) => (
                          <CategoryItems key={index} />
                      ))
                    : categories
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((category) => (
                              <li
                                  key={category.id}
                                  className="group"
                                  onMouseEnter={() =>
                                      setActiveCategory(category.id)
                                  }
                                  onMouseLeave={() => setActiveCategory(null)}
                              >
                                  {/* Category Link */}
                                  <div
                                      className={`flex items-center justify-between py-2 group ${
                                          activeCategory === category.id
                                              ? 'bg-gray-100 text-[#e9a83a]'
                                              : ''
                                      }`}
                                  >
                                      <Link
                                          to={`/seregela-gebeya-v2/category/${category.id}`}
                                          className="flex items-center gap-3 ml-4 text-[#1a1a1a] hover:text-[#e9a83a] text-sm font-medium transition-colors duration-200"
                                      >
                                          <img
                                              src={category.image_path}
                                              alt={category.name}
                                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                          />
                                          <span>{t(category.name)}</span>
                                      </Link>
                                      {category.subcategories.length > 0 && (
                                          <span
                                              className={`
                      text-gray-400 
                      ${
                          activeCategory === category.id
                              ? 'visible'
                              : 'invisible'
                      }
                      transition-opacity duration-300
                    `}
                                          >
                                              ›
                                          </span>
                                      )}
                                  </div>

                                  {/* Subcategories Dropdown */}
                                  {category.subcategories.length > 0 && (
                                      <div
                                          className={`
                    absolute z-50 top-0 left-[calc(100%+0rem)] w-full h-full bg-white shadow-lg overflow-y-auto 
                    ${
                        activeCategory === category.id
                            ? 'visible opacity-100 z-[1000]'
                            : 'invisible opacity-0'
                    }
                    transition-all duration-300 ease-in-out
                    bg-white 
                    min-w-[300px]
                    border border-gray-100
                    z-50
                    transform origin-top-left 
                  `}
                                      >
                                          <div className="p-4">
                                              {/* Category Header */}
                                              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                                                  <img
                                                      src={category.image_path}
                                                      alt={category.name}
                                                      className="w-12 h-12 rounded-full object-cover border-2 border-[#e9a83a]"
                                                  />
                                                  <div>
                                                      <h3 className="font-semibold text-gray-900">
                                                          {t(category.name)}
                                                      </h3>
                                                      <p className="text-sm text-gray-500">
                                                          {category.name}
                                                      </p>
                                                  </div>
                                              </div>

                                              {/* Subcategories List */}
                                              <ul className="space-y-1 max-h-[60vh]">
                                                  {category.subcategories
                                                      .filter(
                                                          (sub) =>
                                                              sub.products_count >
                                                              0
                                                      )
                                                      .map((subcategory) => (
                                                          <li
                                                              key={
                                                                  subcategory.id
                                                              }
                                                              className="hover:bg-gray-100 rounded-md transition-colors duration-150"
                                                          >
                                                              <Link
                                                                  to={`/seregela-gebeya-v2/subcategory/${subcategory.id}`}
                                                                  className="block px-3 py-2 text-sm text-gray-700 hover:text-[#e9a83a]"
                                                              >
                                                                  <div className="flex items-center justify-between">
                                                                      <span>
                                                                          {t(
                                                                              subcategory.name
                                                                          )}
                                                                      </span>
                                                                  </div>
                                                              </Link>
                                                          </li>
                                                      ))}
                                              </ul>
                                          </div>
                                      </div>
                                  )}
                              </li>
                          ))}
            </ul>
        </div>
    );
};

export default CategoryNav;
