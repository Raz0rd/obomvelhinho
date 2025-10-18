'use client';

import { useEffect } from 'react';

export default function Analytics() {
  const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-17657798942';

  useEffect(() => {
    // Google Ads
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    document.head.appendChild(gtagScript);

    const gtagConfig = document.createElement('script');
    gtagConfig.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GOOGLE_ADS_ID}');
    `;
    document.head.appendChild(gtagConfig);

    return () => {
      // Cleanup não é necessário pois os scripts devem persistir
    };
  }, [GOOGLE_ADS_ID]);

  // Renderizar scripts inline também para aparecer no source
  return (
    <>
      {/* Google Ads Global Site Tag - Visível no source */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `,
        }}
      />
    </>
  );
}
