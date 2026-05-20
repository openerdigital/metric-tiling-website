const externalScripts =
  "*.typeform.com *.cognitoforms.com *.calendly.com  *.vercel.live *.vercel.com *.google-analytics.com *.googletagmanager.com *.vimeo.com *.youtube.com *.instagram.com *.twitter.com *.tiktok.com *.ttwstatic.com";

module.exports = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "X-Frame-Options",
    value: "deny",
  },
  {
    key: "Content-Security-Policy",
    value: `script-src 'self' 'unsafe-eval' 'unsafe-inline' ${externalScripts}; worker-src 'self' blob`,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer",
  },
  {
    key: "Feature-Policy",
    value: "vibrate 'none'; geolocation 'none'",
  },
];
