import React from 'react';
import Styles from './Meals.module.css';
import { mockDishes } from '@/app/tools/mockData';
import { IDishExtended } from '@/app/tools/types/mock';

interface Props {
	type: 'breakfast' | 'lunch' | 'dinner';
	searchQuery?: string;
	onAddToOrder?: (dish: IDishExtended) => void;
}

const getTypeLabel = (type: string): string => {
	switch (type) {
		case 'breakfast':
			return 'Завтрак';
		case 'lunch':
			return 'Обед';
		case 'dinner':
			return 'Полдник';
		default:
			return type;
	}
};

const sortDishes = (dishes: IDishExtended[]): IDishExtended[] => {
	return [...dishes].sort((a, b) => {
		// Доступные блюда всегда выше недоступных
		if (a.available && !b.available) return -1;
		if (!a.available && b.available) return 1;
		// Сортировка по названию
		return a.name.localeCompare(b.name, 'ru');
	});
};

const DishCard = ({
	dish,
	onAddToOrder,
}: {
	dish: IDishExtended;
	onAddToOrder?: (dish: IDishExtended) => void;
}) => {
	return (
		<div
			className={`${Styles['dish-card']} ${!dish.available ? Styles.unavailable : ''}`}
		>
			<div className={Styles['dish-header']}>
				<span className={Styles['dish-name']}>{dish.name}</span>
				<span className={Styles['dish-price']}>{dish.price} ₽</span>
			</div>
			{dish.description && (
				<p className={Styles['dish-description']}>{dish.description}</p>
			)}
			<div className={Styles['dish-meta']}>
				<span className={Styles['dish-meta-item']}>🍽️ {dish.weight} г</span>
				<span className={Styles['dish-meta-item']}>📦 {dish.quantity} шт</span>
			</div>
			{dish.available && onAddToOrder && (
				<button
					className={Styles['add-to-order-btn']}
					onClick={() => onAddToOrder(dish)}
				>
					Добавить в заказ
				</button>
			)}
			{!dish.available && (
				<span className={Styles['unavailable-badge']}>Недоступно</span>
			)}
			{dish.available && (
				<span className={Styles['available-badge']}>Доступно</span>
			)}
		</div>
	);
};

const Meals = ({ type, searchQuery = '', onAddToOrder }: Props) => {
	let filteredDishes = mockDishes.filter(dish => dish.type === type);

	// Фильтрация по поисковому запросу
	if (searchQuery.trim()) {
		const query = searchQuery.toLowerCase();
		filteredDishes = filteredDishes.filter(
			dish =>
				dish.name.toLowerCase().includes(query) ||
				(dish.description && dish.description.toLowerCase().includes(query)),
		);
	}

	const sortedDishes = sortDishes(filteredDishes);

	return (
		<div className={Styles['meals-container']}>
			<div className={Styles['meals-header']}>
				<h3>{getTypeLabel(type)}</h3>
			</div>
			<div className={Styles['meals-list']}>
				{sortedDishes.length > 0 ? (
					sortedDishes.map(dish => (
						<DishCard key={dish.id} dish={dish} onAddToOrder={onAddToOrder} />
					))
				) : (
					<div className={Styles['empty-state']}>Нет доступных блюд</div>
				)}
			</div>
		</div>
	);
};

export default Meals;
