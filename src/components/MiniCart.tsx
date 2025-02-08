import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdCloseCircle } from 'react-icons/io';
import defaultImage from '../assets/no-image-available-02.jpg';
const MiniCart: React.FC = () => {
    const [show, setShow] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const handleContinueToCart = () => {
        setShow(false);
        navigate('/seregela-gebeya-v2/cart');
    };

    useEffect(() => {
        if (
            location.pathname === '/seregela-gebeya-v2' &&
            cartItems.length > 0
        ) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [location.pathname, cartItems.length]);

    if (!show) return null;

    function PriceDisplay({ price }: { price: string }) {
        // Format price to ensure 2 decimal places
        const formattedPrice = (price: string) => {
            const numPrice = parseFloat(price);
            return numPrice.toFixed(2);
        };
        const [integerPart, decimalPart] = formattedPrice(price).split('.');

        return (
            <div className="flex items-center ">
                <span className=" items-center">
                    {parseInt(integerPart).toLocaleString('en-US')}
                </span>
                <div className="flex flex-col text-xs text-gray-500">
                    <span className="mb-0 text-xs">.{decimalPart}</span>
                    <span className="product-card-birr-part -mt-1">Birr</span>
                </div>
            </div>
        );
    }

    return (
        <div className="top-4 right-4 bg-white rounded-xl shadow-md p-4 max-w-[300px] z-10 animate-slide-in slide-in mini-cart-container">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
                Don't miss out on what's in your cart!
            </h3>
            <button
                onClick={() => setShow(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
                <IoMdCloseCircle size={24} />
            </button>
            <div className="max-h-[200px] overflow-y-auto">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center py-2 border-b border-gray-200 last:border-b-0"
                    >
                        <img
                            src={item.image_paths?.[0] || defaultImage}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-sm mr-3"
                        />
                        <div>
                            <p className="text-sm text-gray-800 line-clamp-2">
                                {item.name}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mt-1">
                                <PriceDisplay price={item.price} />{' '}
                                <p className="flex items-center text-sm text-gray-600 mt-1 ml-2">
                                    x {item.quantity}
                                </p>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={handleContinueToCart}
                className="mt-3 bg-amber-500 hover:bg-amber-400 w-full text-white py-2 px-4 rounded-full text-sm transition-colors"
            >
                Continue to Cart
            </button>
        </div>
    );
};

export default MiniCart;
