import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPackageToCart } from '../store/features/cartSlice';
import { toggleWishlistItem } from '../store/features/wishlistSlice';
import { ShoppingCart, Heart } from 'lucide-react';
import { RootState } from '../store/store';
import Loader from '../components/Loader';
import defaultImage from '../assets/no-image-available-02.jpg';
import './ProductDetail.css';
import { useTranslation } from 'react-i18next';
import { usePackages } from '../hooks/usePackages';
import { Link } from 'react-router-dom';
import PriceFormatter from './PriceFormatter';

interface ProductDetailCardProps {
    id?: string;
}
const ProductDetailCard: React.FC<ProductDetailCardProps> = ({ id }) => {
    const {
        isLoadingPackageItem,
        packageItemError,
        package: packageItem,
        getPackageById,
    } = usePackages();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const wishlistItems = useSelector(
        (state: RootState) => state.wishlist.items
    );
    const isInWishlist = wishlistItems.some(
        (item) => Number(item.id) === Number(id)
    );
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        console.log('Selected Package ID:', id);
        if (id) {
            getPackageById(id);
        }
    }, [id]);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const handleQuantityChange = (value: string) => {
        if (!packageItem) return;

        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            if (numValue > packageItem.left_in_stock) {
                setQuantity(packageItem.left_in_stock);
            } else if (numValue < 1) {
                setQuantity(1);
            } else {
                setQuantity(numValue);
            }
        }
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHovering(false);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMobile) {
            const { left, top, width, height } =
                e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            setMousePosition({ x, y });
        }
    };

    const handleAddToCart = () => {
        if (packageItem) {
            dispatch(
                addPackageToCart({
                    id: Number(packageItem.id),
                    name: packageItem.name,
                    price: String(packageItem.price),
                    quantity,
                    image_path: packageItem.image_path || '',
                    left_in_stock: packageItem.left_in_stock,
                })
            );
        }
    };

    if (isLoadingPackageItem) {
        return <Loader />;
    }

    if (packageItemError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">{t('error')}</p>
                    <p className="text-gray-600">{packageItemError.message}</p>
                </div>
            </div>
        );
    }

    if (!packageItem) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-gray-600">{t('no_products')}</p>
            </div>
        );
    }

    function PriceDisplay({ price }: { price: number }) {
        const formattedPrice = price.toFixed(2);
        const [integerPart, decimalPart] = formattedPrice.split('.');

        return (
            <div className="flex items-center">
                <span className="product-detail-integer-part items-center">
                    {parseInt(integerPart).toLocaleString('en-US')}
                </span>
                <div className="flex flex-col text-xs text-gray-500">
                    <span className="product-detail-decimal-part">
                        .{decimalPart}
                    </span>
                    <span className="product-detail-birr-part">
                        {t('birr')}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="z-40 mx-auto px-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Product Image Gallery */}
                    <div className="bg-white rounded-lg py-4 shadow-sm  space-y-4">
                        <div className="relative aspect-square">
                            <div
                                className="w-full h-full border rounded-lg overflow-hidden"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onMouseMove={handleMouseMove}
                            >
                                <img
                                    src={
                                        packageItem.image_paths?.[
                                            selectedImageIndex
                                        ] || defaultImage
                                    }
                                    alt={packageItem.name}
                                    className="w-full h-full object-contain rounded-lg cursor-pointer"
                                />
                            </div>
                            {isHovering && (
                                <div
                                    className="absolute z-50 top-0 left-[calc(100%+1.5rem)] w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border"
                                    style={{
                                        backgroundImage: `url(${packageItem.image_paths?.[selectedImageIndex]})`,
                                        backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                                        backgroundSize: '200%',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundOrigin: 'content-box',
                                        padding: '1rem',
                                    }}
                                />
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {packageItem.image_paths?.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {packageItem.image_paths?.map(
                                    (image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImageIndex(index)
                                            }
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all ${
                                                selectedImageIndex === index
                                                    ? 'border-[#e9a83a]'
                                                    : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${packageItem.name} - Thumbnail ${index + 1}`}
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="bg-white rounded-lg py-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-4xl font-bold text-gray-900">
                                {packageItem.name}
                            </h1>
                            <div>
                                <button
                                    onClick={() => {
                                        dispatch(
                                            toggleWishlistItem({
                                                id: Number(packageItem.id),
                                                name: packageItem.name,
                                                price: String(
                                                    packageItem.price
                                                ),
                                                image_paths:
                                                    packageItem.image_paths ||
                                                    [],
                                                left_in_stock:
                                                    packageItem.left_in_stock,
                                                quantity: 1,
                                            })
                                        );
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Heart
                                        size={24}
                                        className={
                                            isInWishlist
                                                ? 'fill-[#e9a83a] text-[#e9a83a]'
                                                : 'text-gray-400'
                                        }
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <PriceDisplay
                                price={parseFloat(packageItem.price)}
                            />
                            {parseFloat(packageItem.discount) > 0 && (
                                <>
                                    <span className="text-lg text-gray-500 line-through">
                                        {(
                                            parseFloat(packageItem.price) *
                                            (1 +
                                                parseFloat(
                                                    packageItem.discount
                                                ) /
                                                    100)
                                        ).toFixed(2)}{' '}
                                        {t('birr')}
                                    </span>
                                    <span className="text-sm text-red-500 font-medium">
                                        {packageItem.discount}% {t('discount')}
                                    </span>
                                </>
                            )}
                        </div>
                        {packageItem.products && (
                            <div className="mb-2">
                                <div className="mt-2 space-y-3 rounded-lg overflow-y-auto border max-h-72  bg-white px-2 py-4 sm:px-6">
                                    <div className="border-b  border-gray-200">
                                        {packageItem.products.map((item) => (
                                            <Link
                                                to={`/seregela-gebeya-v2/products/${item.id}`}
                                                key={item.id}
                                                className="flex hover:text-[#e9a83a] hover:cursor-pointer flex-col rounded-lg bg-white sm:flex-row"
                                            >
                                                <img
                                                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                                                    src={item.image_paths[0]}
                                                    alt={item.name}
                                                />
                                                <div className="flex w-full flex-col px-4 py-4">
                                                    <span className="font-semibold line-clamp-2">
                                                        {item.name}
                                                    </span>
                                                    <span className="float-right text-gray-400">
                                                        {t('quantity')}:{' '}
                                                        {item.pivot.quantity}
                                                    </span>
                                                    <p className="text-lg font-bold">
                                                        <PriceFormatter
                                                            price={item.price}
                                                        />
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        {packageItem && (
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-gray-600">
                                    {t('quantity')}:
                                </span>
                                <div className="relative">
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    e.target.value
                                                )
                                            }
                                            min="1"
                                            max={packageItem.left_in_stock}
                                            className="border rounded-l-lg px-3 py-2 focus:outline-none focus:border-[#e9a83a] w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            onClick={() =>
                                                setIsDropdownOpen(
                                                    !isDropdownOpen
                                                )
                                            }
                                            className="border border-l-0 rounded-r-lg px-3 py-3 hover:bg-gray-50 focus:outline-none focus:border-[#e9a83a]"
                                        >
                                            <svg
                                                className="w-4 h-4 text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    {isDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {Array.from(
                                                {
                                                    length: packageItem.left_in_stock,
                                                },
                                                (_, i) => i + 1
                                            ).map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => {
                                                        handleQuantityChange(
                                                            num.toString()
                                                        );
                                                        setIsDropdownOpen(
                                                            false
                                                        );
                                                    }}
                                                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                                                        quantity === num
                                                            ? 'bg-gray-100'
                                                            : ''
                                                    }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="button_cart w-full bg-[#e9a83a] hover:bg-[#fed874] text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={packageItem.left_in_stock === 0}
                        >
                            <div className="default-btn">
                                <ShoppingCart size={30} />
                                {packageItem.left_in_stock === 0
                                    ? t('out_of_stock')
                                    : t('add_to_cart')}
                            </div>
                            <div className="hover-btn">
                                <span className="mr-2">
                                    <PriceFormatter price={packageItem.price} />
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailCard;
