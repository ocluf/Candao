import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "tailwindcss/tailwind.css";
import { ActorProvider } from "../components/ActorProvider";
import { AuthProvider } from "../components/AuthProvider";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ActorProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ActorProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
