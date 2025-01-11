import React from "react";
import { Clock, Tag } from "lucide-react";
import image1 from "../assets/image_2024-11-09_13-17-51.png";
import image2 from "../assets/image_2024-11-09_13-17-511.png";
import image3 from "../assets/image_2024-11-09_13-17-5111.png";
import image4 from "../assets/image_2024-11-09_13-17-51111.png";
import image5 from "../assets/image_2024-11-09_13-17-511111.png";
import image6 from "../assets/image_2024-11-09_13-19-04.png";
import image7 from "../assets/image_2024-11-09_13-19-05.png";

interface DealCard {
  id: number;
  title: string;
  discount: string;
  imageUrl: string;
}

interface FeaturedDeal {
  id: number;
  title: string;
  discount: string;
  imageUrl: string;
}

const regularDeals: DealCard[] = [
  {
    id: 1,
    title: "Protien Products",
    discount: "Up to 50% off",
    imageUrl: image1,
  },
  {
    id: 2,
    title: "Corn Flex",
    discount: "Up to 50% off",
    imageUrl: image2,
  },
  {
    id: 3,
    title: "School Supplies",
    discount: "Up to 50% off",
    imageUrl: image4,
  },
  {
    id: 4,
    title: "Protien Products",
    discount: "Up to 50% off",
    imageUrl: image3,
  },
  {
    id: 5,
    title: "Enrich Products",
    discount: "Up to 50% off",
    imageUrl: image5,
  },
];

const featuredDeals: FeaturedDeal[] = [
  {
    id: 6,
    title: "",
    discount: "Limited Time Offer",
    imageUrl: image6,
  },
  {
    id: 7,
    title: "",
    discount: "Special Deal",
    imageUrl: image7,
  },
];

const RegularDealCard: React.FC<DealCard> = ({ title, discount, imageUrl }) => (
  <div className="group relative overflow-hidden rounded-xl shadow-md h-[388px]">
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10" />
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-4 h-4 text-amber-400" />
        <span className="text-amber-400 font-semibold">{discount}</span>
      </div>
      <h3 className="text-white text-lg font-bold line-clamp-2">{title}</h3>
    </div>
  </div>
);

const FeaturedDealCard: React.FC<FeaturedDeal> = ({
  title,
  discount,
  imageUrl,
}) => (
  <div className="group relative overflow-hidden rounded-xl shadow-lg h-[230px]">
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 z-10" />
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-5 h-5 text-amber-400" />
        <span className="text-amber-400 font-semibold text-lg">{discount}</span>
      </div>
      <h3 className="text-white text-xl font-bold">{title}</h3>
    </div>
  </div>
);

const MoreDeals: React.FC = () => {
  return (
    <section className="py-12  ">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="explore-more-deals font-semibold text-black">
            Explore More Deals!
          </h2>
          <div className="flex items-center gap-2 text-[#e9a83a] ">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Limited Time Offers</span>
          </div>
        </div>

        {/* Regular Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {regularDeals.map((deal) => (
            <RegularDealCard key={deal.id} {...deal} />
          ))}
        </div>

        {/* Featured Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {featuredDeals.map((deal) => (
            <FeaturedDealCard key={deal.id} {...deal} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreDeals;
