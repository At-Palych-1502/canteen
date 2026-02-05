export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
	throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env');
}

export const endpoints = {
	base: BASE_URL,
	auth: {
		base: BASE_URL,
		login: '/auth/login',
		user: '/user',
	},
	dishes: {
		base: `${BASE_URL}/dishes`,
		addIngredient: '/add-ingredient',
	},
	ingredients: {
		base: `${BASE_URL}/ingredients`,
	},
};
