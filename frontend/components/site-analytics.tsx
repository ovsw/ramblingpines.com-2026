import Script from "next/script";
import { fetchSanitySettings } from "@/sanity/lib/fetch";

export async function SiteAnalytics() {
  const settings = await fetchSanitySettings({ perspective: "published", stega: false });
  const container = settings?.gtmContainerId?.trim();
  if (!container || !/^GTM-[A-Z0-9]+$/.test(container)) return null;
  return <Script id="camp-google-tag-manager" strategy="afterInteractive">{`
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=${container}';
    document.head.appendChild(script);
  `}</Script>;
}
