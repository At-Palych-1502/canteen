import {
	IDishExtended,
	IAllergy,
	IFeedback,
	IBuyOption,
	IDailyMeals,
	IOrder,
	IBuyRequest,
} from './types/mock';
import { IUser, UserRole } from '@/app/tools/types/user.d';

// Моковые данные блюд
export const mockDishes: IDishExtended[] = [
	// Завтраки
	{
		id: 1,
		name: 'Овсяная каша',
		weight: 200,
		quantity: 50,
		type: 'breakfast',
		available: true,
		price: 45,
		description: 'Овсяная каша с молоком и ягодами',
	},
	{
		id: 2,
		name: 'Гренки',
		weight: 150,
		quantity: 30,
		type: 'breakfast',
		available: true,
		price: 35,
		description: 'Тосты с сыром и помидорами',
	},
	{
		id: 3,
		name: 'Яичница',
		weight: 120,
		quantity: 40,
		type: 'breakfast',
		available: false,
		price: 40,
		description: 'Яичница с беконом',
	},
	{
		id: 4,
		name: 'Сырники',
		weight: 180,
		quantity: 25,
		type: 'breakfast',
		available: true,
		price: 55,
		description: 'Сырники со сметаной',
	},
	{
		id: 5,
		name: 'Бутерброд',
		weight: 100,
		quantity: 60,
		type: 'breakfast',
		available: true,
		price: 30,
		description: 'Бутерброд с колбасой',
	},
	// Обеды
	{
		id: 6,
		name: 'Борщ',
		weight: 250,
		quantity: 45,
		type: 'lunch',
		available: true,
		price: 60,
		description: 'Борщ со сметаной и пампушками',
	},
	{
		id: 7,
		name: 'Котлета',
		weight: 150,
		quantity: 35,
		type: 'lunch',
		available: true,
		price: 70,
		description: 'Котлета с гарниром',
	},
	{
		id: 8,
		name: 'Плов',
		weight: 200,
		quantity: 40,
		type: 'lunch',
		available: false,
		price: 80,
		description: 'Плов с курицей',
	},
	{
		id: 9,
		name: 'Салат',
		weight: 150,
		quantity: 50,
		type: 'lunch',
		available: true,
		price: 45,
		description: 'Салат из свежих овощей',
	},
	{
		id: 10,
		name: 'Компот',
		weight: 200,
		quantity: 55,
		type: 'lunch',
		available: true,
		price: 25,
		description: 'Компот из сухофруктов',
	},
	{
		id: 11,
		name: 'Рыба',
		weight: 150,
		quantity: 30,
		type: 'lunch',
		available: true,
		price: 85,
		description: 'Рыба запеченная с овощами',
	},
	// Полдники
	{
		id: 12,
		name: 'Печенье',
		weight: 100,
		quantity: 70,
		type: 'dinner',
		available: true,
		price: 30,
		description: 'Печенье овсяное',
	},
	{
		id: 13,
		name: 'Йогурт',
		weight: 150,
		quantity: 45,
		type: 'dinner',
		available: true,
		price: 40,
		description: 'Йогурт натуральный с фруктами',
	},
	{
		id: 14,
		name: 'Фрукты',
		weight: 200,
		quantity: 50,
		type: 'dinner',
		available: false,
		price: 50,
		description: 'Набор сезонных фруктов',
	},
	{
		id: 15,
		name: 'Булочка',
		weight: 80,
		quantity: 60,
		type: 'dinner',
		available: true,
		price: 25,
		description: 'Булочка с изюмом',
	},
	{
		id: 16,
		name: 'Какао',
		weight: 180,
		quantity: 40,
		type: 'dinner',
		available: true,
		price: 35,
		description: 'Какао с молоком',
	},
];

// Моковые данные аллергенов
export const mockAllergies: IAllergy[] = [
	{ id: 1, name: 'Молоко', checked: false },
	{ id: 2, name: 'Яйца', checked: false },
	{ id: 3, name: 'Орехи', checked: false },
	{ id: 4, name: 'Рыба', checked: false },
	{ id: 5, name: 'Глютен', checked: false },
	{ id: 6, name: 'Соя', checked: false },
	{ id: 7, name: 'Морепродукты', checked: false },
	{ id: 8, name: 'Цитрусовые', checked: false },
];

// Моковые данные отзывов
export const mockFeedbacks: IFeedback[] = [
	{
		id: 1,
		dishId: 1,
		dishName: 'Овсяная каша',
		rating: 5,
		comment: 'Очень вкусная каша!',
		date: '2024-01-15',
		userId: 'user1',
	},
	{
		id: 2,
		dishId: 6,
		dishName: 'Борщ',
		rating: 4,
		comment: 'Хороший борщ, но мог бы быть горячее',
		date: '2024-01-14',
		userId: 'user2',
	},
	{
		id: 3,
		dishId: 7,
		dishName: 'Котлета',
		rating: 5,
		comment: 'Отличная котлета!',
		date: '2024-01-13',
		userId: 'user1',
	},
	{
		id: 4,
		dishId: 12,
		dishName: 'Печенье',
		rating: 3,
		comment: 'Обычное печенье',
		date: '2024-01-12',
		userId: 'user3',
	},
	{
		id: 5,
		dishId: 4,
		dishName: 'Сырники',
		rating: 5,
		comment: 'Лучшие сырники в школе!',
		date: '2024-01-11',
		userId: 'user1',
	},
];

// Моковые данные опций покупки
export const mockBuyOptions: IBuyOption[] = [
	{
		id: 'single',
		name: 'Разовый обед',
		description: 'Оплата одного приема пищи',
		price: 150,
		period: 'на один раз',
		type: 'single',
	},
	{
		id: 'week',
		name: 'Абонемент на неделю',
		description: '5 обедов в неделю',
		price: 650,
		period: 'на неделю',
		type: 'week',
	},
	{
		id: 'month',
		name: 'Абонемент на месяц',
		description: '20 обедов в месяц',
		price: 2500,
		period: 'на месяц',
		type: 'month',
	},
];

// Mock-функция для получения комплексных обедов по дню недели
export const getDailyMeals = (day: number): IDailyMeals => {
	const weekMeals: IDailyMeals[] = [
		// Понедельник
		{
			day: 0,
			date: 'Понедельник',
			breakfast: {
				id: 'breakfast-0',
				type: 'breakfast',
				name: 'Завтрак',
				description: 'Овсяная каша с ягодами и чай',
				price: 80,
				calories: 350,
				dishes: [
					{ id: 1, name: 'Овсяная каша', weight: 200, price: 45 },
					{ id: 16, name: 'Чай', weight: 200, price: 15 },
				],
			},
			lunch: {
				id: 'lunch-0',
				type: 'lunch',
				name: 'Обед',
				description: 'Борщ, котлета с гарниром и компот',
				price: 150,
				calories: 700,
				dishes: [
					{ id: 6, name: 'Борщ', weight: 250, price: 60 },
					{ id: 7, name: 'Котлета с гарниром', weight: 200, price: 70 },
					{ id: 10, name: 'Компот', weight: 200, price: 20 },
				],
			},
			dinner: {
				id: 'dinner-0',
				type: 'dinner',
				name: 'Полдник',
				description: 'Печенье и какао',
				price: 50,
				calories: 250,
				dishes: [
					{ id: 12, name: 'Печенье', weight: 100, price: 30 },
					{ id: 16, name: 'Какао', weight: 180, price: 20 },
				],
			},
		},
		// Вторник
		{
			day: 1,
			date: 'Вторник',
			breakfast: {
				id: 'breakfast-1',
				type: 'breakfast',
				name: 'Завтрак',
				description: 'Гренки с сыром и кофе',
				price: 75,
				calories: 320,
				dishes: [
					{ id: 2, name: 'Гренки', weight: 150, price: 35 },
					{ id: 16, name: 'Кофе', weight: 200, price: 20 },
				],
			},
			lunch: {
				id: 'lunch-1',
				type: 'lunch',
				name: 'Обед',
				description: 'Плов, салат и компот',
				price: 160,
				calories: 750,
				dishes: [
					{ id: 8, name: 'Плов', weight: 200, price: 80 },
					{ id: 9, name: 'Салат', weight: 150, price: 45 },
					{ id: 10, name: 'Компот', weight: 200, price: 20 },
				],
			},
			dinner: {
				id: 'dinner-1',
				type: 'dinner',
				name: 'Полдник',
				description: 'Йогурт и фрукты',
				price: 70,
				calories: 280,
				dishes: [
					{ id: 13, name: 'Йогурт', weight: 150, price: 40 },
					{ id: 14, name: 'Фрукты', weight: 200, price: 30 },
				],
			},
		},
		// Среда
		{
			day: 2,
			date: 'Среда',
			breakfast: {
				id: 'breakfast-2',
				type: 'breakfast',
				name: 'Завтрак',
				description: 'Сырники со сметаной и чай',
				price: 85,
				calories: 380,
				dishes: [
					{ id: 4, name: 'Сырники', weight: 180, price: 55 },
					{ id: 16, name: 'Чай', weight: 200, price: 15 },
				],
			},
			lunch: {
				id: 'lunch-2',
				type: 'lunch',
				name: 'Обед',
				description: 'Рыба с овощами, салат и компот',
				price: 170,
				calories: 680,
				dishes: [
					{ id: 11, name: 'Рыба', weight: 150, price: 85 },
					{ id: 9, name: 'Салат', weight: 150, price: 45 },
					{ id: 10, name: 'Компот', weight: 200, price: 20 },
				],
			},
			dinner: {
				id: 'dinner-2',
				type: 'dinner',
				name: 'Полдник',
				description: 'Булочка и чай',
				price: 45,
				calories: 220,
				dishes: [
					{ id: 15, name: 'Булочка', weight: 80, price: 25 },
					{ id: 16, name: 'Чай', weight: 200, price: 15 },
				],
			},
		},
		// Четверг
		{
			day: 3,
			date: 'Четверг',
			breakfast: {
				id: 'breakfast-3',
				type: 'breakfast',
				name: 'Завтрак',
				description: 'Бутерброд и кофе',
				price: 65,
				calories: 300,
				dishes: [
					{ id: 5, name: 'Бутерброд', weight: 100, price: 30 },
					{ id: 16, name: 'Кофе', weight: 200, price: 20 },
				],
			},
			lunch: {
				id: 'lunch-3',
				type: 'lunch',
				name: 'Обед',
				description: 'Борщ, котлета с гарниром и компот',
				price: 150,
				calories: 700,
				dishes: [
					{ id: 6, name: 'Борщ', weight: 250, price: 60 },
					{ id: 7, name: 'Котлета с гарниром', weight: 200, price: 70 },
					{ id: 10, name: 'Компот', weight: 200, price: 20 },
				],
			},
			dinner: {
				id: 'dinner-3',
				type: 'dinner',
				name: 'Полдник',
				description: 'Печенье и какао',
				price: 50,
				calories: 250,
				dishes: [
					{ id: 12, name: 'Печенье', weight: 100, price: 30 },
					{ id: 16, name: 'Какао', weight: 180, price: 20 },
				],
			},
		},
		// Пятница
		{
			day: 4,
			date: 'Пятница',
			breakfast: {
				id: 'breakfast-4',
				type: 'breakfast',
				name: 'Завтрак',
				description: 'Овсяная каша и чай',
				price: 70,
				calories: 340,
				dishes: [
					{ id: 1, name: 'Овсяная каша', weight: 200, price: 45 },
					{ id: 16, name: 'Чай', weight: 200, price: 15 },
				],
			},
			lunch: {
				id: 'lunch-4',
				type: 'lunch',
				name: 'Обед',
				description: 'Плов, салат и компот',
				price: 160,
				calories: 750,
				dishes: [
					{ id: 8, name: 'Плов', weight: 200, price: 80 },
					{ id: 9, name: 'Салат', weight: 150, price: 45 },
					{ id: 10, name: 'Компот', weight: 200, price: 20 },
				],
			},
			dinner: {
				id: 'dinner-4',
				type: 'dinner',
				name: 'Полдник',
				description: 'Йогурт и фрукты',
				price: 70,
				calories: 280,
				dishes: [
					{ id: 13, name: 'Йогурт', weight: 150, price: 40 },
					{ id: 14, name: 'Фрукты', weight: 200, price: 30 },
				],
			},
		},
		// Суббота
		{
			day: 5,
			date: 'Суббота',
			breakfast: {
				id: 'breakfast-5',
				type: 'breakfast',
				name: 'Завтрак',
				description: 'Сырники и кофе',
				price: 80,
				calories: 370,
				dishes: [
					{ id: 4, name: 'Сырники', weight: 180, price: 55 },
					{ id: 16, name: 'Кофе', weight: 200, price: 20 },
				],
			},
			lunch: {
				id: 'lunch-5',
				type: 'lunch',
				name: 'Обед',
				description: 'Рыба с овощами, салат и компот',
				price: 170,
				calories: 680,
				dishes: [
					{ id: 11, name: 'Рыба', weight: 150, price: 85 },
					{ id: 9, name: 'Салат', weight: 150, price: 45 },
					{ id: 10, name: 'Компот', weight: 200, price: 20 },
				],
			},
			dinner: {
				id: 'dinner-5',
				type: 'dinner',
				name: 'Полдник',
				description: 'Булочка и какао',
				price: 50,
				calories: 240,
				dishes: [
					{ id: 15, name: 'Булочка', weight: 80, price: 25 },
					{ id: 16, name: 'Какао', weight: 180, price: 20 },
				],
			},
		},
		// Воскресенье
		{
			day: 6,
			date: 'Воскресенье',
			breakfast: {
				id: 'breakfast-6',
				type: 'breakfast',
				name: 'Завтрак',
				description: 'Гренки и чай',
				price: 60,
				calories: 310,
				dishes: [
					{ id: 2, name: 'Гренки', weight: 150, price: 35 },
					{ id: 16, name: 'Чай', weight: 200, price: 15 },
				],
			},
			lunch: {
				id: 'lunch-6',
				type: 'lunch',
				name: 'Обед',
				description: 'Борщ, котлета с гарниром и компот',
				price: 150,
				calories: 700,
				dishes: [
					{ id: 6, name: 'Борщ', weight: 250, price: 60 },
					{ id: 7, name: 'Котлета с гарниром', weight: 200, price: 70 },
					{ id: 10, name: 'Компот', weight: 200, price: 20 },
				],
			},
			dinner: {
				id: 'dinner-6',
				type: 'dinner',
				name: 'Полдник',
				description: 'Печенье и чай',
				price: 45,
				calories: 230,
				dishes: [
					{ id: 12, name: 'Печенье', weight: 100, price: 30 },
					{ id: 16, name: 'Чай', weight: 200, price: 15 },
				],
			},
		},
	];

	return weekMeals[day] || weekMeals[0];
};

export const getCurrentOrders = (): IOrder[] => [
	{
		id: 1,
		date: '1770516369000', // 7 февраля 2026
		meals: [
			{
				id: 1,
				name: 'Овсяная каша',
				weight: 200,
				quantity: 50,
			},
			{
				id: 4,
				name: 'Сырники',
				weight: 180,
				quantity: 25,
			},
		],
	},
	{
		id: 2,
		date: '1770602769000', // 8 февраля 2026 (сегодня)
		meals: [
			{
				id: 6,
				name: 'Борщ',
				weight: 250,
				quantity: 45,
			},
			{
				id: 7,
				name: 'Котлета',
				weight: 150,
				quantity: 35,
			},
		],
	},
	{
		id: 3,
		date: '1770689169000', // 9 февраля 2026
		meals: [
			{
				id: 12,
				name: 'Печенье',
				weight: 100,
				quantity: 70,
			},
		],
	},
];

// Моковые данные пользователей
const mockUsers: IUser[] = [
	{
		id: 1,
		username: 'admin',
		role: 'admin',
		email: 'admin@school.ru',
	},
	{
		id: 2,
		username: 'ivanov',
		role: 'student',
		email: 'ivanov@school.ru',
	},
	{
		id: 3,
		username: 'petrov',
		role: 'student',
		email: 'petrov@school.ru',
	},
	{
		id: 4,
		username: 'sidorov',
		role: 'cook',
		email: 'sidorov@school.ru',
	},
	{
		id: 5,
		username: 'kozlova',
		role: 'student',
		email: 'kozlova@school.ru',
	},
	{
		id: 6,
		username: 'morozov',
		role: 'student',
		email: 'morozov@school.ru',
	},
	{
		id: 7,
		username: 'volkov',
		role: 'student',
		email: 'volkov@school.ru',
	},
	{
		id: 8,
		username: 'novikov',
		role: 'student',
		email: 'novikov@school.ru',
	},
	{
		id: 9,
		username: 'lebedev',
		role: 'cook',
		email: 'lebedev@school.ru',
	},
	{
		id: 10,
		username: 'kozlov',
		role: 'student',
		email: 'kozlov@school.ru',
	},
	{
		id: 11,
		username: 'ivanova',
		role: 'student',
		email: 'ivanova@school.ru',
	},
	{
		id: 12,
		username: 'petrova',
		role: 'student',
		email: 'petrova@school.ru',
	},
	{
		id: 13,
		username: 'smirnov',
		role: 'student',
		email: 'smirnov@school.ru',
	},
	{
		id: 14,
		username: 'popov',
		role: 'student',
		email: 'popov@school.ru',
	},
	{
		id: 15,
		username: 'vasilev',
		role: 'student',
		email: 'vasilev@school.ru',
	},
	{
		id: 16,
		username: 'mikhailov',
		role: 'student',
		email: 'mikhailov@school.ru',
	},
	{
		id: 17,
		username: 'fedorov',
		role: 'student',
		email: 'fedorov@school.ru',
	},
	{
		id: 18,
		username: 'alexeev',
		role: 'student',
		email: 'alexeev@school.ru',
	},
	{
		id: 19,
		username: 'andreev',
		role: 'student',
		email: 'andreev@school.ru',
	},
	{
		id: 20,
		username: 'sergeev',
		role: 'student',
		email: 'sergeev@school.ru',
	},
];

export const getUsers = (): IUser[] => {
	return [...mockUsers];
};

export const changeRole = (userId: number, newRole: UserRole): boolean => {
	const userIndex = mockUsers.findIndex(u => u.id === userId);
	if (userIndex === -1) {
		return false;
	}
	mockUsers[userIndex].role = newRole;
	return true;
};

export const deleteUser = (userId: number): boolean => {
	const userIndex = mockUsers.findIndex(u => u.id === userId);
	if (userIndex === -1) {
		return false;
	}
	mockUsers.splice(userIndex, 1);
	return true;
};

export const getFeedback = () => [
	{
		text: 'text1',
		date: '1770689169000',
	},
	{
		text: 'text2',
		date: '1770689169000',
	},
];

// Моковые данные заявок на покупки
const mockBuyRequests: IBuyRequest[] = [
	{
		id: 1,
		author: {
			username: 'sidorov',
			fullName: 'Сидоров Иван Петрович',
			id: 4,
		},
		ingredient: {
			id: 1,
			name: 'Морковь',
		},
		requestedQuantity: 15,
		currentStock: 3,
		unit: 'кг',
		status: 'pending',
		createdAt: '2026-02-08T10:30:00Z',
	},
	{
		id: 2,
		author: {
			username: 'lebedev',
			fullName: 'Лебедев Алексей Сергеевич',
			id: 9,
		},
		ingredient: {
			id: 2,
			name: 'Картофель',
		},
		requestedQuantity: 25,
		currentStock: 8,
		unit: 'кг',
		status: 'approved',
		createdAt: '2026-02-07T14:20:00Z',
		updatedAt: '2026-02-07T15:45:00Z',
	},
	{
		id: 3,
		author: {
			username: 'sidorov',
			fullName: 'Сидоров Иван Петрович',
			id: 4,
		},
		ingredient: {
			id: 3,
			name: 'Лук репчатый',
		},
		requestedQuantity: 10,
		currentStock: 5,
		unit: 'кг',
		status: 'rejected',
		createdAt: '2026-02-07T09:15:00Z',
		updatedAt: '2026-02-07T11:30:00Z',
	},
	{
		id: 4,
		author: {
			username: 'lebedev',
			fullName: 'Лебедев Алексей Сергеевич',
			id: 9,
		},
		ingredient: {
			id: 4,
			name: 'Мука пшеничная',
		},
		requestedQuantity: 50,
		currentStock: 12,
		unit: 'кг',
		status: 'pending',
		createdAt: '2026-02-08T08:45:00Z',
	},
	{
		id: 5,
		author: {
			username: 'sidorov',
			fullName: 'Сидоров Иван Петрович',
			id: 4,
		},
		ingredient: {
			id: 5,
			name: 'Сахар',
		},
		requestedQuantity: 20,
		currentStock: 7,
		unit: 'кг',
		status: 'pending',
		createdAt: '2026-02-08T11:00:00Z',
	},
	{
		id: 6,
		author: {
			username: 'lebedev',
			fullName: 'Лебедев Алексей Сергеевич',
			id: 9,
		},
		ingredient: {
			id: 6,
			name: 'Масло подсолнечное',
		},
		requestedQuantity: 10,
		currentStock: 2,
		unit: 'л',
		status: 'approved',
		createdAt: '2026-02-06T16:30:00Z',
		updatedAt: '2026-02-06T17:15:00Z',
	},
	{
		id: 7,
		author: {
			username: 'sidorov',
			fullName: 'Сидоров Иван Петрович',
			id: 4,
		},
		ingredient: {
			id: 7,
			name: 'Яйца',
		},
		requestedQuantity: 100,
		currentStock: 30,
		unit: 'шт',
		status: 'pending',
		createdAt: '2026-02-08T12:15:00Z',
	},
	{
		id: 8,
		author: {
			username: 'lebedev',
			fullName: 'Лебедев Алексей Сергеевич',
			id: 9,
		},
		ingredient: {
			id: 8,
			name: 'Молоко',
		},
		requestedQuantity: 30,
		currentStock: 15,
		unit: 'л',
		status: 'rejected',
		createdAt: '2026-02-05T13:00:00Z',
		updatedAt: '2026-02-05T14:20:00Z',
	},
];

export const getBuyRequests = (): IBuyRequest[] => {
	return [...mockBuyRequests];
};

export const approveBuyRequest = (requestId: number): boolean => {
	const requestIndex = mockBuyRequests.findIndex(r => r.id === requestId);
	if (requestIndex === -1) {
		return false;
	}
	mockBuyRequests[requestIndex].status = 'approved';
	mockBuyRequests[requestIndex].updatedAt = new Date().toISOString();
	return true;
};

export const rejectBuyRequest = (requestId: number): boolean => {
	const requestIndex = mockBuyRequests.findIndex(r => r.id === requestId);
	if (requestIndex === -1) {
		return false;
	}
	mockBuyRequests[requestIndex].status = 'rejected';
	mockBuyRequests[requestIndex].updatedAt = new Date().toISOString();
	return true;
};

export const updateBuyRequestQuantity = (
	requestId: number,
	newQuantity: number,
): boolean => {
	const requestIndex = mockBuyRequests.findIndex(r => r.id === requestId);
	if (requestIndex === -1) {
		return false;
	}
	mockBuyRequests[requestIndex].requestedQuantity = newQuantity;
	mockBuyRequests[requestIndex].updatedAt = new Date().toISOString();
	return true;
};
