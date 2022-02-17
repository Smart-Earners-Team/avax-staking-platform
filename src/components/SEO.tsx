import { siteUrl } from "globalData";
import React from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  pageDescription?: string;
  slug: string;
  lang?: string;
}

export default function SEO({
  title,
  pageDescription,
  slug,
  lang = "en",
}: SEOProps) {
  const url = siteUrl;
  const description =
    pageDescription || "ASP Community Staking Platform built on AVALANCHE";
  const metaImages = {
    og: "asp-og-image-large.jpg",
    twitter: "asp-og-image-small.jpg",
  };
  const getMetaImageUrl = (image: string) => `${url}images/${image}`;

  return (
    <>
      <Helmet
        htmlAttributes={{ lang }}
        {...(title
          ? {
              titleTemplate: `%s — ASP Staking Platform`,
              title,
            }
          : {
              title: `ASP Staking Platform`,
            })}
        meta={[
          {
            name: "description",
            content: description,
          },
          {
            property: "og:url",
            content: url,
          },
          {
            property: "og:title",
            content: title || "ASP Staking Platform",
          },
          {
            property: "og:description",
            content: description,
          },
          {
            name: "twitter:card",
            content: "summary",
          },
          {
            name: "twitter:title",
            content: title || "ASP Staking Platform",
          },
          {
            name: "twitter:description",
            content: description,
          },
        ]
          .concat([
            {
              property: "og:image",
              content: getMetaImageUrl(metaImages.og),
            },
            {
              name: "twitter:image",
              content: getMetaImageUrl(metaImages.twitter),
            },
          ])}
      />
    </>
  );
}
