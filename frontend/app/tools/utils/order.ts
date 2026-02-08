import { IComplexMeal } from '@/app/tools/types/mock';

// Ключ для хранения заказа в localStorage
const ORDER_STORAGE_KEY = 'canteen_order';

export interface IOrderItem {
	dishId: number;
	dishName: string;
	quantity: number;
	price: number;
}

export interface IOrder {
	items: IOrderItem[];
	totalPrice: number;
	createdAt: string;
}

export interface IComplexOrderItem {
	mealId: string;
	mealName: string;
	mealType: string;
	day: number;
	dayName: string;
	price: number;
}

export interface IComplexOrder {
	items: IComplexOrderItem[];
	totalPrice: number;
	createdAt: string;
}

// Получить заказ из localStorage
export const getOrder = (): IOrder | null => {
	const orderData = localStorage.getItem(ORDER_STORAGE_KEY);
	if (!orderData) return null;

	try {
		return JSON.parse(orderData) as IOrder;
	} catch (error) {
		console.error('Error parsing order from localStorage:', error);
		return null;
	}
};

// Сохранить заказ в localStorage
export const saveOrder = (order: IOrder): void => {
	try {
		localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
	} catch (error) {
		console.error('Error saving order to localStorage:', error);
	}
};

// Очистить заказ из localStorage
export const clearOrder = (): void => {
	try {
		localStorage.removeItem(ORDER_STORAGE_KEY);
	} catch (error) {
		console.error('Error clearing order from localStorage:', error);
	}
};

// Добавить блюдо в заказ
export const addDishToOrder = (
	dishId: number,
	dishName: string,
	price: number,
): boolean => {
	const order = getOrder();

	if (!order) {
		const newOrder: IOrder = {
			items: [
				{
					dishId,
					dishName,
					quantity: 1,
					price,
				},
			],
			totalPrice: price,
			createdAt: new Date().toISOString(),
		};
		saveOrder(newOrder);
		return true;
	}

	const existingItem = order.items.find(item => item.dishId === dishId);
	if (existingItem) {
		existingItem.quantity += 1;
	} else {
		order.items.push({
			dishId,
			dishName,
			quantity: 1,
			price,
		});
	}

	order.totalPrice += price;
	saveOrder(order);
	return true;
};

// Проверить, можно ли добавить блюдо (валидация по типу)
export const canAddDish = (
	dishId: number,
	dishType: string,
	currentOrder: IOrder | null,
): boolean => {
	if (!currentOrder) return true;

	// Проверяем, есть ли уже блюдо этого типа
	const hasDishOfSameType = currentOrder.items.some(
		item => getDishType(item.dishId) === dishType,
	);

	if (hasDishOfSameType) {
		return false;
	}

	return true;
};

// Получить тип блюда по ID
const getDishType = (dishId: number): string => {
	// В реальном приложении это будет через API
	// Для демонстрации используем моковые данные
	const dishTypes: Record<number, string> = {
		1: 'breakfast',
		2: 'breakfast',
		3: 'breakfast',
		4: 'breakfast',
		5: 'breakfast',
		6: 'lunch',
		7: 'lunch',
		8: 'lunch',
		9: 'lunch',
		10: 'lunch',
		11: 'lunch',
		12: 'dinner',
		13: 'dinner',
		14: 'dinner',
		15: 'dinner',
	};

	return dishTypes[dishId] || 'unknown';
};

// Удалить блюдо из заказа
export const removeDishFromOrder = (dishId: number): boolean => {
	const order = getOrder();

	if (!order) return false;

	const newItems = order.items.filter(item => item.dishId !== dishId);

	if (newItems.length === 0) {
		clearOrder();
		return false;
	}

	const newTotalPrice = newItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	const newOrder: IOrder = {
		...order,
		items: newItems,
		totalPrice: newTotalPrice,
	};

	saveOrder(newOrder);
	return true;
};

// Изменить количество блюда в заказе
export const updateDishQuantity = (
	dishId: number,
	quantity: number,
): boolean => {
	const order = getOrder();

	if (!order) return false;

	const newItems = order.items.map(item =>
		item.dishId === dishId ? { ...item, quantity } : item,
	);

	const newTotalPrice = newItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	const newOrder: IOrder = {
		...order,
		items: newItems,
		totalPrice: newTotalPrice,
	};

	saveOrder(newOrder);
	return true;
};

// Получить общее количество блюд в заказе
export const getOrderCount = (): number => {
	const order = getOrder();
	if (!order) return 0;
	return order.items.reduce((sum, item) => sum + item.quantity, 0);
};

// Функции для работы с комплексными обедами

// Ключ для хранения комплексных заказов в localStorage
const COMPLEX_ORDER_STORAGE_KEY = 'canteen_complex_order';

// Получить комплексный заказ из localStorage
export const getComplexOrder = (): IComplexOrder | null => {
	const orderData = localStorage.getItem(COMPLEX_ORDER_STORAGE_KEY);
	if (!orderData) return null;

	try {
		return JSON.parse(orderData) as IComplexOrder;
	} catch (error) {
		console.error('Error parsing complex order from localStorage:', error);
		return null;
	}
};

// Сохранить комплексный заказ в localStorage
export const saveComplexOrder = (order: IComplexOrder): void => {
	try {
		localStorage.setItem(COMPLEX_ORDER_STORAGE_KEY, JSON.stringify(order));
	} catch (error) {
		console.error('Error saving complex order to localStorage:', error);
	}
};

// Очистить комплексный заказ из localStorage
export const clearComplexOrder = (): void => {
	try {
		localStorage.removeItem(COMPLEX_ORDER_STORAGE_KEY);
	} catch (error) {
		console.error('Error clearing complex order from localStorage:', error);
	}
};

// Добавить комплексный обед в заказ
export const addComplexMealToOrder = (
	meal: IComplexMeal,
	day: number,
	dayName: string,
): boolean => {
	const complexOrder = getComplexOrder();

	const newOrderItem: IComplexOrderItem = {
		mealId: meal.id,
		mealName: meal.name,
		mealType: meal.type,
		day,
		dayName,
		price: meal.price,
	};

	if (!complexOrder) {
		const newOrder: IComplexOrder = {
			items: [newOrderItem],
			totalPrice: meal.price,
			createdAt: new Date().toISOString(),
		};
		saveComplexOrder(newOrder);
		return true;
	}

	// Проверяем, есть ли уже этот обед в заказе
	const existingItemIndex =
		complexOrder.items?.findIndex(item => item.mealId === meal.id) ?? -1;

	if (existingItemIndex >= 0) {
		// Удаляем обед из заказа (toggle)
		const newItems =
			complexOrder.items?.filter(item => item.mealId !== meal.id) ?? [];
		const newTotalPrice = newItems.reduce((sum, item) => sum + item.price, 0);

		if (newItems.length === 0) {
			clearComplexOrder();
			return true;
		}

		const newOrder: IComplexOrder = {
			...complexOrder,
			items: newItems,
			totalPrice: newTotalPrice,
		};
		saveComplexOrder(newOrder);
		return true;
	}

	// Добавляем новый обед в заказ
	const newOrder: IComplexOrder = {
		...complexOrder,
		items: [...(complexOrder.items ?? []), newOrderItem],
		totalPrice: (complexOrder.totalPrice ?? 0) + meal.price,
	};
	saveComplexOrder(newOrder);
	return true;
};

// Получить комплексный заказ
export const getCurrentComplexOrder = (): IComplexOrder | null => {
	return getComplexOrder();
};

// Сохранить все выбранные обеды в заказе (замена всего заказа)
export const saveAllComplexMealsToOrder = (
	meals: IComplexMeal[],
	day: number,
	dayName: string,
): void => {
	if (meals.length === 0) {
		clearComplexOrder();
		return;
	}

	const newOrderItems: IComplexOrderItem[] = meals.map(meal => ({
		mealId: meal.id,
		mealName: meal.name,
		mealType: meal.type,
		day,
		dayName,
		price: meal.price,
	}));

	const totalPrice = newOrderItems.reduce((sum, item) => sum + item.price, 0);

	const newOrder: IComplexOrder = {
		items: newOrderItems,
		totalPrice,
		createdAt: new Date().toISOString(),
	};

	saveComplexOrder(newOrder);
};
