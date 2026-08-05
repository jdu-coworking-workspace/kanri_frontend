import Head from "next/head";
import { Footer, Header } from "..";

const Layout = ({ children }) => {
   return (
      <>
         <Head>
            {/* Meta taglar va Favicon qoladi */}
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="author" content="stonix.uz" />
            <meta name="robots" content="index, follow" />
            <meta name="format-detection" content="telephone=no" />

            {/* <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="shortcut icon" href="/images/favicon-white.png" /> */}

            <meta name="theme-color" content="#ffffff" />

            {/* FONT LINKLARI BU YERDAN O'CHIRILDI */}
         </Head>

         {/* <CustomCursor /> */}
         <Header />
         <main>{children}</main>
         <Footer />
      </>
   );
};

export default Layout;