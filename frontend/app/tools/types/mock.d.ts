// Расширенные типы для моковых данных блюд

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type OrderType = 'single' | 'week' | 'month';

export interface IDishExtended {
	id: number;
	name: string;
	weight: number;
	quantity: number;
	type: MealType;
	available: boolean;
	price: number;
	description?: string;
	image?: string;
}

export interface IFeedback {
	id: number;
	dishId: number;
	dishName: string;
	rating: number;
	comment: string;
	date: string;
	userId?: string;
}

export interface IAllergy {
	id: number;
	name: string;
	checked: boolean;
}

export interface IBuyOption {
	id: string;
	name: string;
	description: string;
	price: number;
	period: string;
	type: OrderType;
}

export interface ISelectedDish {
	dish: IDishExtended;
	quantity: number;
}

// Типы для комплексных обедов
export interface IDishItem {
	id: number;
	name: string;
	weight: number;
	price: number;
}

export interface IComplexMeal {
	id: string;
	type: MealType;
	name: string;
	description: string;
	price: number;
	calories: number;
	dishes: IDishItem[];
}

export interface IDailyMeals {
	day: number;
	date: string;
	breakfast: IComplexMeal;
	lunch: IComplexMeal;
	dinner: IComplexMeal;
}

export interface IOrder {
	id: string;
	date: string;
	mealType: MealType;
	meal: IComplexMeal;
	createdAt: string;
}
