export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
	throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env');
}

export const endpoints = {
	base: BASE_URL,
	auth: {
		base: BASE_URL,
		login: '/auth/login',
		register: '/auth/register',
		user: '/user',
	},
	users: {
		getAll: '/users',
		getUser: '/user',
		changeRole: '/change_role',
		delete: '/user',
	},
	dishes: {
		base: `${BASE_URL}/dishes`,
		addIngredient: '/add-ingredient',
	},
	ingredients: {
		base: `${BASE_URL}/ingredients`,
		putIngridientsRequest: `${BASE_URL}/purchase_requests`,
	},
	meals: {
		base: `${BASE_URL}/meals`,
	},
	buyRequests: {
		base: `${BASE_URL}/purchase_requests`,
		getMealsDayOfWeek: `${BASE_URL}/meals_by_day`,
		setMealsCount: `${BASE_URL}/set_meals_count`,
	},
	reviews: {
		base: '/reviews',
	},
};
