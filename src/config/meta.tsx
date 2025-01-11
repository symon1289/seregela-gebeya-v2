import { Product } from "../types/product";

export const DEFAULT_TITLE =
  "Seregela Gebeya - Ethiopian Online Shopping Marketplace";
export const DEFAULT_DESCRIPTION =
  "Discover a wide range of products at Seregela Gebeya. Shop online for electronics, fashion, home goods, and more with great deals and fast delivery across Ethiopia.";
export const DEFAULT_KEYWORDS =
  "online shopping, Ethiopia, marketplace, electronics, fashion, home goods, Seregela Gebeya";

export interface MetaConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export const getHomeMetaTags = (): MetaConfig => ({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  ogTitle: DEFAULT_TITLE,
  ogDescription: DEFAULT_DESCRIPTION,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: DEFAULT_TITLE,
  twitterDescription: DEFAULT_DESCRIPTION,
});

export const getProductMetaTags = (product: Product): MetaConfig => ({
  title: `${product.name} - Seregela Gebeya`,
  description:
    product.description ||
    `Buy ${product.name} at Seregela Gebeya. Best prices in Ethiopia.`,
  keywords: `${product.name}, online shopping, Ethiopia, Seregela Gebeya`,
  ogTitle: `${product.name} - Seregela Gebeya`,
  ogDescription:
    product.description ||
    `Buy ${product.name} at Seregela Gebeya. Best prices in Ethiopia.`,
  ogType: "product",
  ogImage: product.image_paths?.[0],
  twitterCard: "summary_large_image",
  twitterTitle: `${product.name} - Seregela Gebeya`,
  twitterDescription:
    product.description ||
    `Buy ${product.name} at Seregela Gebeya. Best prices in Ethiopia.`,
  twitterImage: product.image_paths?.[0],
});

export const getCategoryMetaTags = (categoryName: string): MetaConfig => ({
  title: `${categoryName} - Seregela Gebeya`,
  description: `Shop ${categoryName} at Seregela Gebeya. Find the best deals and prices in Ethiopia.`,
  keywords: `${categoryName}, online shopping, Ethiopia, Seregela Gebeya`,
  ogTitle: `${categoryName} - Seregela Gebeya`,
  ogDescription: `Shop ${categoryName} at Seregela Gebeya. Find the best deals and prices in Ethiopia.`,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: `${categoryName} - Seregela Gebeya`,
  twitterDescription: `Shop ${categoryName} at Seregela Gebeya. Find the best deals and prices in Ethiopia.`,
});

export const getWishlistMetaTags = (): MetaConfig => ({
  title: "My Wishlist - Seregela Gebeya",
  description: "View and manage your wishlist at Seregela Gebeya.",
  keywords: "wishlist, favorites, online shopping, Ethiopia, Seregela Gebeya",
  ogTitle: "My Wishlist - Seregela Gebeya",
  ogDescription: "View and manage your wishlist at Seregela Gebeya.",
  ogType: "website",
  twitterCard: "summary",
  twitterTitle: "My Wishlist - Seregela Gebeya",
  twitterDescription: "View and manage your wishlist at Seregela Gebeya.",
});

export const getCartMetaTags = (): MetaConfig => ({
  title: "Shopping Cart - Seregela Gebeya",
  description: "View and manage your shopping cart at Seregela Gebeya.",
  keywords:
    "shopping cart, checkout, online shopping, Ethiopia, Seregela Gebeya",
  ogTitle: "Shopping Cart - Seregela Gebeya",
  ogDescription: "View and manage your shopping cart at Seregela Gebeya.",
  ogType: "website",
  twitterCard: "summary",
  twitterTitle: "Shopping Cart - Seregela Gebeya",
  twitterDescription: "View and manage your shopping cart at Seregela Gebeya.",
});

export const getCheckoutMetaTags = (): MetaConfig => ({
  title: "Checkout - Seregela Gebeya",
  description: "Complete your purchase at Seregela Gebeya.",
  keywords: "checkout, payment, online shopping, Ethiopia, Seregela Gebeya",
  ogTitle: "Checkout - Seregela Gebeya",
  ogDescription: "Complete your purchase at Seregela Gebeya.",
  ogType: "website",
  twitterCard: "summary",
  twitterTitle: "Checkout - Seregela Gebeya",
  twitterDescription: "Complete your purchase at Seregela Gebeya.",
});

export const getLoginMetaTags = (): MetaConfig => ({
  title: "Login - Seregela Gebeya",
  description: "Log in to your account at Seregela Gebeya.",
  keywords: "login, account, online shopping, Ethiopia, Seregela Gebeya",
  ogTitle: "Login - Seregela Gebeya",
  ogDescription: "Log in to your account at Seregela Gebeya.",
  ogType: "website",
  twitterCard: "summary",
  twitterTitle: "Login - Seregela Gebeya",
  twitterDescription: "Log in to your account at Seregela Gebeya.",
});

export const getAllProductsMetaTags = (): MetaConfig => ({
  title: "All Products - Seregela Gebeya",
  description:
    "Discover a wide range of products at Seregela Gebeya. Shop online for electronics, fashion, home goods, and more with great deals and fast delivery across Ethiopia.",
  keywords:
    "online shopping, Ethiopia, marketplace, electronics, fashion, home goods, Seregela Gebeya",
  ogTitle: "All Products - Seregela Gebeya",
  ogDescription:
    "Discover a wide range of products at Seregela Gebeya. Shop online for electronics, fashion, home goods, and more with great deals and fast delivery across Ethiopia.",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "All Products - Seregela Gebeya",
  twitterDescription:
    "Discover a wide range of products at Seregela Gebeya. Shop online for electronics, fashion, home goods, and more with great deals and fast delivery across Ethiopia.",
});

export const getNotFoundMetaTags = (): MetaConfig => ({
  title: "Page Not Found - Seregela Gebeya",
  description: "The page you are looking for could not be found.",
  keywords: "page not found, 404, online shopping, Ethiopia, Seregela Gebeya",
  ogTitle: "Page Not Found - Seregela Gebeya",
  ogDescription: "The page you are looking for could not be found.",
  ogType: "website",
  twitterCard: "summary",
  twitterTitle: "Page Not Found - Seregela Gebeya",
  twitterDescription: "The page you are looking for could not be found.",
});

export const getFAQMetaTags = (): MetaConfig => ({
  title: "Frequently Asked Questions - Seregela Gebeya",
  description: "Find answers to commonly asked questions about Seregela's products, shipping, returns, and customer service.",
  keywords: "FAQ, frequently asked questions, customer service, shipping, returns, payment methods, Seregela help",
  ogTitle: "FAQ - Seregela Gebeya",
  ogDescription: "Get answers to your questions about Seregela's services and policies.",
  ogType: "website",
  twitterCard: "summary",
  twitterTitle: "FAQ - Seregela Gebeya",
  twitterDescription: "Get answers to your questions about Seregela's services and policies.",
});

export const getContactMetaTags = (): MetaConfig => ({
  title: "Contact Us - Seregela Gebeya",
  description: "Get in touch with Seregela's customer support team. We're here to help with your questions, feedback, and concerns.",
  keywords: "contact us, customer support, help, feedback, Seregela contact",
  ogTitle: "Contact Us - Seregela Gebeya",
  ogDescription: "Reach out to Seregela's support team for assistance.",
  ogType: "website",
  twitterCard: "summary",
  twitterTitle: "Contact Us - Seregela Gebeya",
  twitterDescription: "Reach out to Seregela's support team for assistance.",
});

export const getSizeGuideMetaTags = (): MetaConfig => ({
  title: "Size Guide - Seregela Gebeya",
  description: "Find your perfect fit with Seregela's comprehensive size guide. Get detailed measurements and fitting tips for all our clothing categories.",
  keywords: "size guide, size chart, measurements, fitting guide, clothing sizes, how to measure, Seregela size guide",
  ogTitle: "Size Guide - Seregela Gebeya",
  ogDescription: "Find your perfect fit with our detailed size guide and measurement instructions.",
  ogType: "website",
  twitterCard: "summary",
  twitterTitle: "Size Guide - Seregela Gebeya",
  twitterDescription: "Find your perfect fit with our detailed size guide and measurement instructions.",
});
