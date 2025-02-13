import React from "react";
import { getReturnPolicyMetaTags } from "../config/meta";
import Meta from "../components/Meta";
const DeliveryReturnPolicy: React.FC = () => {
    return (
        <>
            <Meta config={getReturnPolicyMetaTags()} />
            <div className=" text-gray-800 max-w-screen-xl  mx-auto py-10 px-5">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
                    Delivery and Return Policy
                </h1>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Delivery Policy
                    </h2>
                    <p>
                        We strive to provide fast and reliable delivery services
                        to our customers. Our delivery charges are as follows:
                    </p>
                    <ul className="list-disc pl-5">
                        <li>
                            Orders under 3,000 ETB: A delivery fee of{" "}
                            <strong>300 ETB</strong> will be applied.
                        </li>
                        <li>
                            Orders over 3,000 ETB: Enjoy{" "}
                            <strong>free delivery</strong> on your purchase.
                        </li>
                    </ul>
                    <p className="mt-2">
                        <strong>Delivery Timeframe:</strong>
                    </p>
                    <ul className="list-disc pl-5">
                        <li>
                            Standard delivery: 2-5 business days depending on
                            your location.
                        </li>
                        <li>
                            Expedited delivery options may be available at an
                            additional cost.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Return Policy
                    </h2>
                    <p>
                        We want you to be fully satisfied with your purchase. If
                        you are not happy with your order, you may return it
                        under the following conditions:
                    </p>
                    <ul className="list-disc pl-5">
                        <li>
                            <strong>Return Window:</strong> Returns must be
                            initiated within <strong>7 days</strong> of
                            receiving the order.
                        </li>
                        <li>
                            <strong>Eligibility:</strong> The item must be{" "}
                            <strong>unused, in its original packaging</strong>,
                            and include all accessories.
                        </li>
                        <li>
                            <strong>Non-Returnable Items:</strong> Perishable
                            goods, personal care items, and custom-made products
                            cannot be returned.
                        </li>
                        <li>
                            <strong>Return Process:</strong> To initiate a
                            return, contact our customer service team with your
                            order details.
                        </li>
                        <li>
                            <strong>Refunds:</strong> Once the returned item is
                            inspected and approved, refunds will be issued to
                            your original payment method within{" "}
                            <strong>5-10 business days</strong>.
                        </li>
                    </ul>
                </section>
            </div>
        </>
    );
};

export default DeliveryReturnPolicy;
