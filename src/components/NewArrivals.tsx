import { useTranslation } from "react-i18next";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";

const NewArrivals = () => {
  const { t } = useTranslation();
  const {
    filteredProducts: newArrivals,
    isLoading: newArrivalsLoading,
    hasMore: hasMoreNewArrivals,
    loadMore: loadMoreNewArrivals,
  } = useProducts({
    id: undefined,
    endpoint: "products",
    initialItemsToLoad: 14,
  });
  return (
    <section className="mb-0 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="explore-more-deals font-semibold mb-6">
          {" "}
          {t("new_arrivals")}
        </h2>
        {!newArrivalsLoading && hasMoreNewArrivals && (
          <button
            onClick={loadMoreNewArrivals}
            className="bg-primary hover:bg-secondary text-white transition-colors py-2 px-4 rounded-lg font-semibold"
          >
            {t("loadMore")}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-[11px] py-4 md:grid-cols-4 lg:grid-cols-7 row-span-2 grid-rows-2">
        {newArrivals.map((product) => (
          <ProductCard
            id={product.id}
            key={product.id}
            name={product.name}
            image={product.image}
            originalPrice={product.price}
            price={product.price}
            discount={product.discount ? Number(product.discount) : undefined}
            left_in_stock={product.left_in_stock}
          />
        ))}
      </div>
      {newArrivalsLoading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
