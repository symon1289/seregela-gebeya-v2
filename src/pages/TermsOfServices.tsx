import React from "react";
import Meta from "../components/Meta";
import { getTermsAndConditionsMetaTags } from "../config/meta";

const TermsOfServices: React.FC = () => {
    return (
        <>
            <Meta config={getTermsAndConditionsMetaTags()} />
            <div className="max-w-4xl mx-auto py-10 px-5">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
                    Terms of Service
                </h1>
                <p className="text-lg mb-6">
                    Welcome to Seregela Gebeya! By using our ecommerce website
                    and mobile app, you agree to abide by the following terms
                    and conditions. Please read them carefully before using our
                    services.
                </p>
                <div className="space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using Seregela Gebeya, you agree to
                            be bound by these Terms of Service, our Privacy
                            Policy, and all applicable laws and regulations. If
                            you do not agree, please do not use our platform.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            2. Use of Our Services
                        </h2>
                        <p>
                            Users must be at least 18 years old or have parental
                            permission to use our services. You agree to provide
                            accurate, complete, and current information during
                            registration and use of the platform.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            3. Account Security
                        </h2>
                        <p>
                            You are responsible for maintaining the
                            confidentiality of your account credentials and for
                            all activities conducted under your account.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            4. Purchases and Payments
                        </h2>
                        <p>
                            All transactions made through our platform are
                            subject to availability and approval. We reserve the
                            right to cancel or refuse orders at our discretion.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            5. Returns and Refunds
                        </h2>
                        <p>
                            Returns and refunds are subject to our return
                            policy. Please review our policy before making a
                            purchase.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            6. Prohibited Activities
                        </h2>
                        <p>
                            You agree not to engage in activities that violate
                            laws, infringe on intellectual property, or disrupt
                            the services provided by Seregela Gebeya.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            7. Limitation of Liability
                        </h2>
                        <p>
                            Seregela Gebeya is not liable for any indirect,
                            incidental, or consequential damages arising from
                            your use of the platform.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            8. Termination
                        </h2>
                        <p>
                            We reserve the right to suspend or terminate your
                            account at any time if you violate these terms.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            9. Changes to Terms
                        </h2>
                        <p>
                            We may update these Terms of Service at any time.
                            Continued use of our platform constitutes acceptance
                            of the revised terms.
                        </p>
                    </section>
                </div>
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Contact Us
                    </h2>
                    <p>
                        If you have any questions about our Terms of Service,
                        please contact us:
                    </p>
                    <p className="mt-2">
                        <strong>Phone:</strong> 020-83701062
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        <a
                            href="mailto:service@Seregela Gebeya.com"
                            className="text-blue-500"
                        >
                            service@Seregela Gebeya.com
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default TermsOfServices;
