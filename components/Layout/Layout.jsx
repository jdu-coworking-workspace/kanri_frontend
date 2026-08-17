import Head from "next/head";
import { Footer, Header } from "..";

const Layout = ({ children }) => {
   return (
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
         <Head>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="author" content="stonix.uz" />
            <meta name="robots" content="index, follow" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="theme-color" content="#ffffff" />
         </Head>

         <Header />
         <main>{children}</main>
         <Footer />
      </div>
   );
};

export default Layout;