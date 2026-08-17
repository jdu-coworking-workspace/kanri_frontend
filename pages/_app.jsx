import { Provider } from "react-redux";
import { useRouter } from "next/router";
import store from "../redux/store/store";
import { Layout } from "../components";
import AuthLayout from "../components/Layout/AuthLayout";
import uz from "../lang/uz.json";
import en from "../lang/en.json";
import ru from "../lang/ru.json";
import jp from "../lang/jp.json";
import { IntlProvider } from "react-intl";
import { LangProvider } from "../context/useLang";
import { SkeletonTheme } from "react-loading-skeleton";
import NProgress from "nprogress";
import { initCollapse } from "../utils/collapse";
import { Flip, ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import { useEffect } from "react";

// CSS Styles
import "../public/styles/nprogress.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

import { ThemeProvider, useTheme } from "@/context/useTheme";

const messages = { ru, uz, en, jp };

// Theme Context elementlariga kirish va UI xizmatlarini ko'rsatish uchun ichki komponent
function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const { isDarkMode } = useTheme(); // Endi bu yerda ishonchli ishlaydi

  const isAuthPage = Component.layout === "auth";

  useEffect(() => {
    try {
      const handleStart = () => NProgress.start();
      const handleStop = () => NProgress.done();

      router.events.on("routeChangeStart", handleStart);
      router.events.on("routeChangeComplete", handleStop);
      router.events.on("routeChangeError", handleStop);

      initCollapse();

      return () => {
        router.events.off("routeChangeStart", handleStart);
        router.events.off("routeChangeComplete", handleStop);
        router.events.off("routeChangeError", handleStop);
      };
    } catch (error) {
      console.error("Error initializing collapse:", error);
    }
  }, [router]);

  const renderContent = () => {
    if (isAuthPage) {
      return (
        <AuthLayout>
          <Component {...pageProps} />
        </AuthLayout>
      );
    }

    return (
      <Layout>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            dedupingInterval: 10000,
            shouldRetryOnError: false,
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </Layout>
    );
  };

  return (
    <SkeletonTheme
      baseColor={isDarkMode ? "#1e293b" : "#ebebeb"}
      highlightColor={isDarkMode ? "#334155" : "#f5f5f5"}
    >
      {renderContent()}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        draggable
        theme={isDarkMode ? "dark" : "light"}
        transition={Flip}
      />
    </SkeletonTheme>
  );
}

export default function App(props) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <IntlProvider
        locale={router.locale}
        defaultLocale={router.defaultLocale}
        messages={{ ...messages[router.locale] }}
        onError={() => null}
      >
        <ThemeProvider>
          <LangProvider>
            <AppContent {...props} />
          </LangProvider>
        </ThemeProvider>
      </IntlProvider>
    </Provider>
  );
}