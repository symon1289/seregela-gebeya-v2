import React, { useState } from "react";
import { getFAQMetaTags } from "../config/meta";
import Meta from "../components/Meta";
const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I create an account?",
            answer: "To create an account, click on the 'Sign Up' button on the homepage and enter your details.",
        },
        {
            question: "How can I reset my password?",
            answer: "Click on 'Forgot Password' on the login page and follow the instructions to reset your password.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept credit/debit cards, PayPal, and mobile payment options.",
        },
        {
            question: "How can I track my order?",
            answer: "Log in to your account and go to 'My Orders' to track your order status.",
        },
        {
            question: "What is your return policy?",
            answer: "You can return items within 30 days of delivery. Please visit our Returns page for details.",
        },
    ];

    return (
        <>
            <Meta config={getFAQMetaTags()} />
            <div className=" text-gray-900 max-w-screen-xl  mx-auto py-10 px-5">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
                    Frequently Asked Questions
                </h1>
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-lg overflow-hidden"
                        >
                            <button
                                className="w-full text-left p-4 bg-gray-100 focus:outline-none"
                                onClick={() => toggleAccordion(index)}
                            >
                                {index + 1}. {faq.question}
                            </button>
                            {openIndex === index && (
                                <div className="p-4 bg-white">{faq.answer}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default FAQ;
