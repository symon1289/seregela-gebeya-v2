import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/filters/Sidebar';
import { useProducts } from '../hooks/useProducts';
import { useCategory } from '../hooks/useCategory';
import Meta from '../components/Meta';
import { getCategoryMetaTags } from '../config/meta';
import Breadcrumb from '../components/Breadcrumb';
import { useTranslation } from 'react-i18next';
import defaultImage from '../assets/no-image-available-02.jpg';

const Subcategory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { categories } = useCategory();
    const {
        filteredProducts,
        isLoading,
        error,
        hasMore,
        minPrice,
        maxPrice,
        sortBy,
        loadMore,
        handlePriceChange,
        handleSortChange,
    } = useProducts({ id: Number(id), endpoint: 'subcategories' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const activeSubcategory = categories.reduce((found: any, category) => {
        if (found) return found;
        return category.subcategories.find((sub) => sub.id === Number(id));
    }, null);

    if (!id) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg text-gray-600">
                    Loading subcategory...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error.message}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {activeSubcategory && (
                <Meta config={getCategoryMetaTags(activeSubcategory.name)} />
            )}
            <div className="max-w-7xl mx-auto px-4 py-4">
                {activeSubcategory && (
                    <Breadcrumb
                        paths={[
                            {
                                name: 'Products',
                                url: '/seregela-gebeya-v2/products',
                            },
                            {
                                name:
                                    categories.find((cat) =>
                                        cat.subcategories.some(
                                            (sub) => sub.id === Number(id)
                                        )
                                    )?.name || '',
                                url: `/seregela-gebeya-v2/category/${
                                    categories.find((cat) =>
                                        cat.subcategories.some(
                                            (sub) => sub.id === Number(id)
                                        )
                                    )?.id
                                }`,
                            },
                            {
                                name: activeSubcategory.name,
                                url: `/seregela-gebeya-v2/subcategory/${activeSubcategory.id}`,
                            },
                        ]}
                    />
                )}
                <div className="flex gap-[11px] mt-6">
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(!isSidebarOpen)}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onPriceChange={handlePriceChange}
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                    />

                    <div className="flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[11px]">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.image || defaultImage}
                                    originalPrice={product.price}
                                    discount={
                                        product.discount
                                            ? Number(product.discount)
                                            : undefined
                                    }
                                    left_in_stock={product.left_in_stock}
                                />
                            ))}
                        </div>

                        {isLoading && (
                            <div className="flex justify-center mt-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e9a83a]"></div>
                            </div>
                        )}

                        {!isLoading && hasMore && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={loadMore}
                                    className="px-6 py-2 bg-[#e9a83a] text-white rounded-md hover:bg-[#d49732] transition-colors"
                                >
                                    {t('loadMore')}
                                </button>
                            </div>
                        )}

                        {!isLoading &&
                            !hasMore &&
                            filteredProducts.length === 0 && (
                                <div className="text-center mt-8 text-gray-500">
                                    {t('no_items_via_this_filter')}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Subcategory;
