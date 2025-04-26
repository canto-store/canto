export function OrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://canto-store.com";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Canto",
    url: baseUrl,
    logo: `${baseUrl}/web-app-manifest-512x512.png`,
    sameAs: [
      "https://facebook.com/cantomarketplace",
      "https://twitter.com/cantomarketplace",
      "https://instagram.com/cantomarketplace",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+20-123-456-7890",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
