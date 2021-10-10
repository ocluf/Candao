import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import { ActorProvider } from "../components/ActorProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ActorProvider>
      <Component {...pageProps} />
    </ActorProvider>
  );
}
export default MyApp;
