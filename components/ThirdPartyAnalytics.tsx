import Script from "next/script";

// Measurement IDs are public (they appear in every page). Env vars override the defaults.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-NH9M4L34S6"; // GA4 property "abundanthomedesign.com" (nancy@abundanthomedesign.com)
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "zda5vmb91d"; // Clarity project "Abundant Home" (nancy@abundanthomedesign.com)
// Only load tracking on the production site, so previews and local runs do not pollute the data.
const enabled = process.env.VERCEL_ENV === "production";

export function ThirdPartyAnalytics() {
  if (!enabled) return null;
  return (
    <>
      {GA_ID && /^G-[A-Z0-9]+$/.test(GA_ID) && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {CLARITY_ID && /^[a-z0-9]+$/i.test(CLARITY_ID) && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}
    </>
  );
}
