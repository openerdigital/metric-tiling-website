import useExternalScripts from "@helpers/useExternalScripts";
import { useScript } from "@helpers/useScript";
import type { AppProps } from "next/app";
import "src/styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  // Load external scripts
  useExternalScripts();
  useScript("//www.instagram.com/embed.js");

  return <Component {...pageProps} />;
}

export default MyApp;
