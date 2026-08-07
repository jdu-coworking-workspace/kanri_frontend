import Document, { Html, Head, Main, NextScript } from "next/document";
import nextConfig from "../next.config";

class MyDocument extends Document {
  render() {
    const currentLocale =
      this.props.__NEXT_DATA__.locale || nextConfig.i18n.defaultLocale;

    return (
      <Html lang={currentLocale}>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <noscript
            dangerouslySetInnerHTML={{
              __html:
                '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MLW6T4V" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
            }}
          ></noscript>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
