import Head from "next/head";

/**
 * AuthLayout — Auth sahifalari (Login, Register, Forgot Password) uchun maxsus layout.
 * Header va Footer ko'rsatilmaydi.
 */
const AuthLayout = ({ children }) => {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      {children}
    </>
  );
};

export default AuthLayout;
