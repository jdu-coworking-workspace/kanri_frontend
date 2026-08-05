import Head from "next/head";

const Seo = ({
	children,
	title = "CADS Academy | Zamonaviy Kiber-Xavfsizlik Akademiyasi",
	description = "CADS Academy - O'zbekistondagi yetakchi kiber-xavfsizlik markazi. Kurslar, amaliy ssenariylar va xalqaro sertifikatlarga tayyorlov dasturlari.",
	keywords = "cads, cads academy, kiber-xavfsizlik, cyber security, dasturlash, uzbekistan cyber, it kurslar, xavfsizlik akademiyasi",
	link = "https://cads.uz/",
	image = "/images/og-image.jpg", // Sayt ulashilganda chiqadigan asosiy rasm
}) => {
	return (
		<Head>
			{/* Basic Meta Tags */}
			<title>{title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
			<meta name="keywords" content={keywords} />
			<meta name="description" content={description} />
			<meta name="author" content="cads.uz" />
			<meta name="robots" content="index, follow" />

			{/* Favicons & Icons */}
			<link rel="icon" href="/favicon.ico" />
			<link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
			<link rel="manifest" href="/site.webmanifest" />

			{/* CADS Brand Colors */}
			<meta name="theme-color" content="#2563eb" /> {/* Blue-600 rangi */}
			<meta name="msapplication-TileColor" content="#020617" /> {/* Dark background */}

			{/* Open Graph / Facebook */}
			<meta property="og:type" content="website" />
			<meta property="og:url" content={link} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			<meta property="og:site_name" content="CADS Academy" />
			<meta property="og:locale" content="uz_UZ" />

			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:url" content={link} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />
			<meta name="twitter:creator" content="@cads_academy" />

			{/* Additional Security Headers (Meta orqali) */}
			<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
			<meta name="language" content="Uzbek" />

			{/* Canonical Link */}
			<link rel="canonical" href={link} />

			{children}
		</Head>
	);
};

export default Seo;