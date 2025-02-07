// import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Meta from "../components/Meta";
import { getHomeMetaTags } from "../config/meta";
import CategoryGrid from "../components/CategoryGrid";
import MoreDeals from "../components/MoreDeals";
import NewArrivals from "../components/NewArrivals";
import FreshSavers from "../components/FreshSavers";
import GrabOurBestDeals from "../components/GrabOurBestDeals";
import left from "../assets/left.png";
import right from "../assets/right.png";
import HeroSlider from "../components/HeroSlider";
import WelcomeSection from "../components/WelcomeSection";
import CategorySidebar from "../components/CategorySidebar";
import { useCategory } from "../hooks/useCategory";
import MiniCart from "../components/MiniCart";

const Home = () => {
  const { categories } = useCategory();
  const { t } = useTranslation();
  return (
    <>
      <Meta config={getHomeMetaTags()} />
      <div className="max-w-screen-xl mx-auto px-4">
        <MiniCart />
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="hidden md:block  md:col-span-3 h-full z-[99]">
            <div className="sticky top-4">
              <CategorySidebar categories={categories} />
            </div>
          </div>
          <div className="md:col-span-6">
            <HeroSlider />
          </div>
          <div className="hidden md:block sm:col-span- md:col-span-3">
            <div className="sticky top-4">
              <WelcomeSection />
            </div>
          </div>
        </section>
        {/* Categories */}
        <section className="mb-12 mt-6">
          <h2 className="explore-more-deals font-semibold mb-6">
            {t("buy_from_choosen_categories")}
          </h2>
          <CategoryGrid />
        </section>

        {/* Fresh Savers */}
        <FreshSavers />
        <GrabOurBestDeals />
        {/* Offer Zone Banner */}

        <section className="mb-12 mt-6">
          <div className="relative mx-auto">
            <img
              src={left}
              alt=""
              className="absolute left-0 top-0 w-[180px] h-[120px] sm:w-[280px] sm:h-[220px] md:w-[376px] md:h-[300px] duration-300"
            />

            <div className="bg-gradient-to-r from-primary to-secondary rounded-[20px] p-6 sm:p-8 text-white h-[100px] sm:h-[180px] md:h-[230px] mx-auto flex justify-center items-center">
              <h2 className="kalubet-enadersalen text-center text-lg sm:text-xl md:text-2xl">
                ካሉበት እናደርሳለን
              </h2>
            </div>

            <img
              src={right}
              alt=""
              className="absolute right-0 top-0 w-[180px] h-[120px] sm:w-[280px] sm:h-[220px] md:w-[376px] md:h-[300px] duration-300"
            />
          </div>
        </section>

        {/* New Arrivals */}
        <NewArrivals />
        {/* More Deals */}
        <MoreDeals />
      </div>
    </>
  );
};

export default Home;
