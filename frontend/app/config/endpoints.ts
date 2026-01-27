export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
	throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env');
}

export const endpoints = {
	auth: {
		login: `${BASE_URL}/api/auth/login`,
		user: `${BASE_URL}/api/auth/user`,
	},
};
