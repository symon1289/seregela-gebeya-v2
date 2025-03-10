import React, { useState, useEffect } from "react";
import { Clock, Tag, Eye } from "lucide-react";
import image6 from "../assets/image_2024-11-09_13-19-04.png";
import image7 from "../assets/image_2024-11-09_13-19-05.png";
import { usePackages } from "../hooks/usePackages";
import { Package } from "../types/product";
import ProductDetailCard from "./ProductDetailCard";
import PackageLoading from "./loading skeletons/package/Card.tsx";
import deualtImage from "../assets/no-image-available-02.jpg";
import PriceFormatter from "./PriceFormatter.tsx";
import { useNavigate } from "react-router-dom";
interface FeaturedDeal {
    id: number;
    title: string;
    discount: string;
    imageUrl: string;
}

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

const RegularDealCard: React.FC<Package & { onViewDetails: () => void }> = ({
    name,
    image_path,
    price,
    onViewDetails,
}) => (
    <div className="group relative overflow-hidden rounded-xl shadow-md h-[388px]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10" />
        <img
            src={image_path || deualtImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-semibold">
                    <PriceFormatter price={price} />
                </span>
            </div>
            <h3 className="text-white text-lg font-bold line-clamp-2">
                {name}
            </h3>
            <button
                onClick={onViewDetails}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
                aria-label="View details"
            >
                <Eye className="w-5 h-5 text-gray-700" />
            </button>
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
                <span className="text-amber-400 font-semibold text-lg">
                    {discount}
                </span>
            </div>
            <h3 className="text-white text-xl font-bold">{title}</h3>
        </div>
    </div>
);

const ErrorDisplay: React.FC<{ error: Error }> = ({ error }) => (
    <div className="mx-auto px-4 py-12">
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
                    <p className="text-sm text-red-700">{error.message}</p>
                </div>
            </div>
        </div>
    </div>
);

const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl max-h-[600px] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
                    aria-label="Close modal"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};

const MoreDeals: React.FC = () => {
    const navigate = useNavigate();
    const { isLoadingPackages, packagesError, packages, getPackages } =
        usePackages();
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch packages on component mount
    useEffect(() => {
        getPackages();
    }, []);

    // Handle view details for a package
    const handleViewDetails = (deal: Package) => {
        setSelectedPackage(deal);
        setIsModalOpen(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setSelectedPackage(null);
        setIsModalOpen(false);
    };

    return (
        <section className="py-6">
            <div className="container mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="explore-more-deals font-semibold text-black">
                        Explore More Deals!
                    </h2>
                    <button
                        className="flex items-center gap-2 text-primary"
                        onClick={() => navigate("/packages")}
                    >
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">
                            Limited Time Offers
                        </span>
                    </button>
                </div>

                {/* Regular Deals Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {isLoadingPackages ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <PackageLoading key={index} />
                        ))
                    ) : packagesError ? (
                        <ErrorDisplay error={packagesError} />
                    ) : (
                        packages.map((pkg) => (
                            <RegularDealCard
                                key={pkg.id}
                                {...pkg}
                                onViewDetails={() => handleViewDetails(pkg)}
                            />
                        ))
                    )}
                </div>

                {/* Featured Deals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    {featuredDeals.map((deal) => (
                        <FeaturedDealCard key={deal.id} {...deal} />
                    ))}
                </div>
            </div>

            {/* Modal for Package Details */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {selectedPackage && (
                    <ProductDetailCard id={selectedPackage.id} />
                )}
            </Modal>
        </section>
    );
};

export default MoreDeals;
