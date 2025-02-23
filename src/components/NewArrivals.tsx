import { useTranslation } from "react-i18next";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import ProductCardLoading from "./loading skeletons/product/Card.tsx";
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
        <section className="mb-0 my-10 ">
            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl sm:text-3xl leading-[19px] font-semibold">
                    {" "}
                    {t("new_arrivals")}
                </h2>
                {!newArrivalsLoading && hasMoreNewArrivals && (
                    <button
                        aria-label="Load More"
                        onClick={loadMoreNewArrivals}
                        className="bg-[#e9a83a] hover:bg-[#fed874] text-white text-sm sm:text-base transition-colors py-2 px-4 rounded-lg font-semibold"
                    >
                        {t("loadMore")}
                    </button>
                )}
            </div>
            <div className="grid grid-cols-2 gap-[11px] py-4 md:grid-cols-4 lg:grid-cols-7 row-span-2 grid-rows-2">
                {newArrivalsLoading
                    ? Array.from({ length: 14 }).map((_, index) => (
                          <ProductCardLoading key={index} />
                      ))
                    : newArrivals.map((product) => (
                          <ProductCard
                              id={product.id}
                              key={product.id}
                              name={product.name}
                              image={product.image}
                              originalPrice={product.originalPrice}
                              price={product.price}
                              discount={
                                  product.discount
                                      ? Number(product.discount)
                                      : undefined
                              }
                              left_in_stock={
                                  product.max_quantity_per_order !== null
                                      ? product.max_quantity_per_order
                                      : product.left_in_stock
                              }
                          />
                      ))}
            </div>
            {/*{newArrivalsLoading && (*/}
            {/*    <div className="flex justify-center mt-8">*/}
            {/*        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e9a83a]"></div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </section>
    );
};

export default NewArrivals;
