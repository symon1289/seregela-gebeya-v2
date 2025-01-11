import React from "react";
import { Helmet } from "react-helmet-async";
import { MetaConfig } from "../config/meta";

interface MetaProps {
  config: MetaConfig;
}

const Meta: React.FC<MetaProps> = ({ config }) => {
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogType,
    ogImage,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
  } = config;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {ogType && <meta property="og:type" content={ogType} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta
        name="twitter:description"
        content={twitterDescription || description}
      />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
    </Helmet>
  );
};

export default Meta;
