import React from "react";
import Meta from "../components/Meta";
import { getPrivacyPolicyMetaTags } from "../config/meta";

const PrivacyPolicy: React.FC = () => {
    return (
        <>
            <Meta config={getPrivacyPolicyMetaTags()} />
            <div className="max-w-4xl mx-auto py-10 px-5">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
                    Privacy Policy
                </h1>
                <p className="text-lg mb-6">
                    Your privacy is important to Seregela Gebeya and always has
                    been. So we've developed a Privacy Policy that covers how we
                    collect, use, disclose, transfer, and store your
                    information. Please take a moment to familiarize yourself
                    with our privacy practices and let us know if you have any
                    questions.
                </p>
                <p className="mb-6">
                    By visiting Seregela Gebeya, you are accepting the practices
                    described in this Privacy Notice.
                </p>
                <div className="space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            1. About this Notice
                        </h2>
                        <p>
                            This Privacy and Cookie Notice provides information
                            on how Seregela Gebeya collects and processes your
                            personal data when you visit our website or mobile
                            applications.
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Process orders</li>
                            <li>Deliver products and services</li>
                            <li>
                                Process payments and communicate with you about
                                your orders, products, services, and promotional
                                offers
                            </li>
                            <li>
                                Keep and update our database and your accounts
                                with us
                            </li>
                            <li>
                                Propose a unique and targeted navigation
                                experience
                            </li>
                            <li>
                                Prevent and detect fraud and abuse on our
                                website
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            2. The data we collect about you
                        </h2>
                        <p>
                            We collect your personal data in order to provide
                            and continually improve our products and services.
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>
                                <strong>Information you provide to us:</strong>{" "}
                                Identity data, contact data, delivery address,
                                and financial data during the checkout process.
                            </li>
                            <li>
                                <strong>
                                    Information on your use of our website:
                                </strong>{" "}
                                Searches, views, downloads, and purchases.
                            </li>
                            <li>
                                <strong>Information from third parties:</strong>{" "}
                                Carriers, payment providers, merchants, and
                                advertising services.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            3. Cookies and how we use them
                        </h2>
                        <p>
                            Cookies allow us to distinguish you from other
                            users, helping us improve your browsing experience.
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>
                                Recognizing and counting visitors to improve
                                website usability.
                            </li>
                            <li>
                                Identifying preferences and personalization.
                            </li>
                            <li>
                                Sending personalized notifications and
                                advertisements.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            4. How we share your personal data
                        </h2>
                        <p>
                            We may share your personal data with third parties
                            for:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Processing orders.</li>
                            <li>Working with payment gateway providers.</li>
                            <li>
                                Business transfers in case of mergers or
                                acquisitions.
                            </li>
                            <li>
                                Detecting fraud and ensuring legal compliance.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            5. Data security
                        </h2>
                        <p>
                            We implement security measures to prevent
                            unauthorized access, alteration, or disclosure of
                            your personal data.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            6. Your legal rights
                        </h2>
                        <p>
                            You have rights under data protection laws,
                            including access, correction, and deletion of your
                            personal data.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            7. Manage Your Account
                        </h2>
                        <p>
                            Through your account settings, you can access, edit,
                            or delete personal information such as:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Name and Username</li>
                            <li>Email address and phone number</li>
                            <li>Physical address</li>
                            <li>Profile information</li>
                        </ul>
                    </section>
                </div>
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Contact Us
                    </h2>
                    <p>If you have any questions, you can contact us:</p>
                    <p className="mt-2">
                        <strong>Phone:</strong> 7878, +251 116177881, +251
                        116177900, +251 978171266, +251 978170879, +251
                        978017313
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        <a
                            href="hello@seregelamail.com"
                            className="text-primary"
                        >
                            hello@seregelamail.com
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
