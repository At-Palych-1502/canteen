import {
	IDishExtended,
	IAllergy,
	IFeedback,
	IBuyOption,
	IDailyMeals,
	IOrder,
} from './types/mock';

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
		date: '1770539545725',
		meals: [
			{
				id: 1,
				name: 'Овсяная каша',
				weight: 200,
				quantity: 50,
			},
		],
	},
	{
		id: 2,
		date: '1770539545625',
		meals: [
			{
				id: 6,
				name: 'Борщ',
				weight: 250,
				quantity: 45,
			},
		],
	},
];
