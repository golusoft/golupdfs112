"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { pageview } from "@/lib/analytics";

function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <>


      {/* Navigation tracking wrapper */}
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>

      {/* Google AdSense Script */}
      {adsenseId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
