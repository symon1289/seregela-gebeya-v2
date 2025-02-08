import React from "react";
import { OrderDetails } from "../../types/order";
import Loader from "../Loader";
import useOrder from "../../hooks/useOrder";
import PriceFormatter from "../PriceFormatter";
import { DeliveryDelayCal, formatDateTime } from "../../utils/TimeCal";

const OrderDetail: React.FC<Pick<OrderDetails, "id">> = ({ id }) => {
    const { useOrderDetails } = useOrder();

    const { data: order, isLoading, isError } = useOrderDetails(id.toString());

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">Error</p>
                    <p className="text-gray-600">{isError}</p>
                </div>
            </div>
        );
    }
    return (
        <main className="py-6 relative">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                <div className="w-full flex-col justify-start items-center gap-4 inline-flex">
                    <div className="w-full flex-col justify-start items-start gap-4 flex">
                        <div className="w-full py-6 border-t border-b border-gray-100 md:justify-between justify-center md:items-start items-center md:gap-8 gap-10 flex flex-wrap">
                            <div className="flex-col justify-start items-start gap-3 inline-flex">
                                <h6 className="text-gray-500 text-base font-normal leading-relaxed">
                                    Order Placed
                                </h6>
                                <h4 className="text-black text-sm font-semibold leading-8">
                                    {order?.created_at &&
                                        formatDateTime(order?.created_at)}
                                </h4>
                            </div>
                            <div className="flex-col justify-start items-start gap-1 inline-flex">
                                {order?.delivered_at !== null ? (
                                    <>
                                        {" "}
                                        <h6 className="text-gray-500 text-base font-normal leading-relaxed">
                                            Order Delivered
                                        </h6>
                                        <h4 className="text-black text-sm font-semibold leading-8">
                                            {order?.delivered_at &&
                                                formatDateTime(
                                                    order?.delivered_at
                                                )}
                                        </h4>
                                    </>
                                ) : (
                                    <>
                                        <h6 className="text-gray-500 text-base font-normal leading-relaxed">
                                            Delivery date
                                        </h6>
                                        <h4 className="text-black text-sm font-semibold leading-8">
                                            {DeliveryDelayCal(
                                                order?.days_left_for_delivery
                                            )}
                                        </h4>
                                    </>
                                )}
                            </div>
                            <div className="flex-col justify-start items-start gap-1 inline-flex">
                                <h6 className="text-gray-500 text-base font-normal leading-relaxed">
                                    No of Items
                                </h6>
                                <h4 className="text-black text-sm font-semibold leading-8">
                                    {order?.products.length}
                                </h4>
                            </div>
                            <div className="flex-col justify-start items-start gap-1 inline-flex">
                                <h6 className="text-gray-500 text-base font-normal leading-relaxed">
                                    Status
                                </h6>
                                <h4 className="text-black text-sm font-semibold leading-8">
                                    {order?.status}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex-col justify-start items-start gap-4 flex">
                        <div className="w-full justify-center items-start ">
                            <div className="w-full hidden md:grid grid-cols-2 p-4 bg-gray-50">
                                <span className="text-gray-500 text-base font-normal leading-relaxed">
                                    Product
                                </span>
                                <p className="flex items-center justify-between">
                                    <span className="w-full max-w-[260px] text-center px-8 text-gray-500 text-base font-normal leading-relaxed ">
                                        Quantity
                                    </span>
                                    <span className="w-full max-w-[200px] text-center px-8 text-gray-500 text-base font-normal leading-relaxed ">
                                        Price
                                    </span>
                                    <span className="w-full max-w-[200px] text-center" />
                                </p>
                            </div>
                            {order &&
                                order.products.map((product: any) => (
                                    <div
                                        key={product.id}
                                        className="grid grid-cols-1 md:grid-cols-2 min-[550px]:gap-6 py-3 border-b border-gray-200 max-sm:max-w-xl max-xl:mx-auto"
                                    >
                                        <div className="flex items-center flex-col min-[550px]:flex-row gap-3 min-[550px]:gap-4 w-full max-sm:justify-center max-sm:max-w-xl max-xl:mx-auto">
                                            <div className="w-[120px] h-[120px] img-box bg-gray-50 rounded-xl justify-center items-center inline-flex">
                                                <img
                                                    src={
                                                        product
                                                            .thumbnail_image_paths[0]
                                                    }
                                                    alt={product.name}
                                                    className="xl:w-[75px] object-cover"
                                                />
                                            </div>
                                            <div className="pro-data w-full max-w-sm flex-col justify-start items-start gap-2 inline-flex">
                                                <h4 className="w-full text-black text-lg font-medium leading-8 max-[550px]:text-center">
                                                    {product.name}
                                                </h4>
                                                <h5 className="w-full text-gray-500 text-base font-normal leading-relaxed min-[550px]:my-0 my-2 max-[550px]:text-center">
                                                    Product ID: {product.id}
                                                </h5>
                                            </div>
                                        </div>
                                        <div className=" flex items-center justify-between flex-col min-[550px]:flex-row w-full max-sm:max-w-xl max-xl:mx-auto gap-2">
                                            <div className="max-w-[160px] flex items-center w-full mx-0 justify-center gap-5">
                                                <p className="w-12 h-12 focus:outline-none text-gray-900 placeholder-gray-900 text-lg font-medium leading-relaxed px-2.5 bg-white rounded-full border border-gray-200 justify-center items-center flex">
                                                    {product?.pivot?.quantity}
                                                </p>
                                            </div>
                                            <h5 className="max-w-[142px] w-full text-center text-black text-lg font-medium leading-relaxed pl-5">
                                                <PriceFormatter
                                                    price={product.price}
                                                />
                                            </h5>
                                            <button className="group max-w-[176px] text-center w-full flex items-center justify-center transition-all duration-700 ease-in-out">
                                                <svg
                                                    className="text-gray-500 group-hover:text-gray-900 transition-all duration-700 ease-in-out"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={40}
                                                    height={40}
                                                    viewBox="0 0 40 40"
                                                    fill="none"
                                                >
                                                    <g filter="url(#filter0_d_484_1442)">
                                                        <path
                                                            d="M13.5 13.5L26.5 26.5M26.5 13.5L13.5 26.5"
                                                            stroke="currentColor"
                                                            strokeWidth="1.6"
                                                            strokeLinecap="round"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <filter
                                                            id="filter0_d_484_1442"
                                                            x={-2}
                                                            y={-1}
                                                            width={44}
                                                            height={44}
                                                            filterUnits="userSpaceOnUse"
                                                            colorInterpolationFilters="sRGB"
                                                        >
                                                            <feFlood
                                                                floodOpacity={0}
                                                                result="BackgroundImageFix"
                                                            />
                                                            <feColorMatrix
                                                                in="SourceAlpha"
                                                                type="matrix"
                                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                                                result="hardAlpha"
                                                            />
                                                            <feOffset dy={1} />
                                                            <feGaussianBlur
                                                                stdDeviation={1}
                                                            />
                                                            <feComposite
                                                                in2="hardAlpha"
                                                                operator="out"
                                                            />
                                                            <feColorMatrix
                                                                type="matrix"
                                                                values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0"
                                                            />
                                                            <feBlend
                                                                mode="normal"
                                                                in2="BackgroundImageFix"
                                                                result="effect1_dropShadow_484_1442"
                                                            />
                                                            <feBlend
                                                                mode="normal"
                                                                in="SourceGraphic"
                                                                in2="effect1_dropShadow_484_1442"
                                                                result="shape"
                                                            />
                                                        </filter>
                                                    </defs>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="w-full justify-start items-start gap-8 grid sm:grid-cols-2 grid-cols-1">
                        <div className="w-full p-6 rounded-xl border border-gray-200 flex-col justify-start items-start gap-4 inline-flex">
                            <div className="w-full justify-between items-start gap-2.5 inline-flex">
                                <h4 className="text-gray-600 text-xl font-medium leading-8">
                                    Discount
                                </h4>
                                <h4 className="text-right text-black text-xl font-medium leading-8">
                                    <PriceFormatter
                                        price={order?.discounted_cost}
                                    />
                                </h4>
                            </div>
                            <div className="w-full justify-between items-start gap-2.5 inline-flex">
                                <h4 className="text-gray-600 text-xl font-medium leading-8">
                                    Delivery
                                </h4>
                                <h4 className="text-right text-black text-xl font-medium leading-8">
                                    {order?.delivery_cost !== 0 ? (
                                        <PriceFormatter
                                            price={order?.delivery_cost}
                                        />
                                    ) : (
                                        <span className="text-green-500">
                                            Free
                                        </span>
                                    )}
                                </h4>
                            </div>
                        </div>
                        <div className="w-full p-6 rounded-xl border border-gray-200 flex-col justify-start items-start gap-4 inline-flex">
                            <div className="w-full justify-between items-start gap-2.5 inline-flex">
                                <h4 className="text-gray-600 text-xl font-medium leading-8">
                                    Subtotal
                                </h4>
                                <h4 className="text-right text-black text-xl font-medium leading-8">
                                    <PriceFormatter price={order?.order_cost} />
                                </h4>
                            </div>
                            <div className="w-full justify-between items-start gap-2.5 inline-flex">
                                <h4 className="text-gray-600 text-xl font-medium leading-8">
                                    Total
                                </h4>
                                <h4 className="text-right text-black text-xl font-medium leading-8">
                                    <PriceFormatter price={order?.total_cost} />
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderDetail;
