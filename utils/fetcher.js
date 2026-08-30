const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// auth fetcher
function updateOptions(options, auth) {
	const headers = {
		Accept: "application/json",
		...options.headers,
	};

	// Faqat so'rovda body bo'lsa Content-Type qo'shamiz
	if (options.body) {
		headers["Content-Type"] = "application/json";
	}

	return {
		credentials: "include",
		...options,
		headers,
	};
}

export default async function fetcher(
	url = "",
	options = {},
	params = {},
	auth = false,
) {
	if (!url) {
		console.error("Fetcher: URL manzil ko'rsatilmadi!");
		return null;
	}

	// console.error("BASE_URL:", process.env.NEXT_PUBLIC_BASE_API_URL);
	// console.error("URL:", url);

	try {
		const cleanUrl = url.replace(/^\/+/, "");
		const __url = new URL(cleanUrl, BASE_URL);

		Object.keys(params).forEach((key) =>
			__url.searchParams.append(key, params[key]),
		);

		const response = await fetch(__url, updateOptions(options, auth));

		if (!response.ok) {
			const errorData = await response.json();
			const enrichedError = new Error(
				errorData.message || "API request failed",
			);
			enrichedError.error = errorData.error;
			enrichedError.status = response.status;
			enrichedError.data = errorData;
			throw enrichedError;
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
}