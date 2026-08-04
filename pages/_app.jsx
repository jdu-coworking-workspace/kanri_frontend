import { Provider } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import store from "../redux/store/store";
import { Layout } from "../components";
import uz from "../lang/uz.json";
import en from "../lang/en.json";
import ru from "../lang/ru.json";
import { IntlProvider } from "react-intl";
import { LangProvider } from "../context/useLang";
import { SkeletonTheme } from "react-loading-skeleton";
import NProgress from "nprogress";
import { initCollapse } from "../utils/collapse";
import { Flip, ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";

// CSS Styles
import "../public/styles/nprogress.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
// import { ModalProvider } from "@/context/modal-context";

const messages = { ru, uz, en };

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Tizim rangini tekshirish yoki localStorage'dan olish
    const isDark = localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

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

  return (
    <Provider store={store}>
      <IntlProvider
        locale={router.locale}
        defaultLocale={router.defaultLocale}
        messages={{ ...messages[router.locale] }}
        onError={() => null}
      >
        {/* <ModalProvider> */}
        <LangProvider>
          <SkeletonTheme
            baseColor={darkMode ? "#1e293b" : "#ebebeb"}
            highlightColor={darkMode ? "#334155" : "#f5f5f5"}
          >
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
            <ToastContainer
              position="top-right"
              autoClose={3000}
              draggable
              theme={darkMode ? "dark" : "light"}
              transition={Flip}
            />
          </SkeletonTheme>
        </LangProvider>
        {/* </ModalProvider> */}
      </IntlProvider>
    </Provider>
  );
}