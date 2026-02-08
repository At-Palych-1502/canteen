import { IOrder } from '@/app/tools/types/mock';
import { IDish } from '@/app/tools/types/dishes';
import React, { useState } from 'react';
import Styles from './CurrentOrder.module.css';

interface Props {
	order: IOrder;
}

const Order = ({ order }: Props) => {
	const [isReceived, setIsReceived] = useState(false);

	// Проверяем, является ли дата сегодняшней
	const isToday = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const orderDate = new Date(parseInt(order.date));
		orderDate.setHours(0, 0, 0, 0);
		return today.getTime() === orderDate.getTime();
	};

	// Форматируем дату для отображения
	const formatDate = (dateString: string) => {
		const date = new Date(parseInt(dateString));
		const options: Intl.DateTimeFormatOptions = {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		};
		return date.toLocaleDateString('ru-RU', options);
	};

	const handleReceiveOrder = () => {
		setIsReceived(true);
		// Здесь можно добавить логику отправки на сервер
	};

	const today = isToday();

	return (
		<div className={Styles['order-card']}>
			<div className={Styles['order-header']}>
				<span className={Styles['order-date']}>{formatDate(order.date)}</span>
				{today && <span className={Styles['order-today-badge']}>Сегодня</span>}
			</div>
			<div className={Styles['order-meals']}>
				{order.meals.map((meal: IDish, index: number) => (
					<div
						key={`${order.id}-${meal.id}-${index}`}
						className={Styles['meal-item']}
					>
						<span className={Styles['meal-name']}>{meal.name}</span>
						<span className={Styles['meal-info']}>{meal.weight}г</span>
					</div>
				))}
			</div>
			{today && !isReceived && (
				<button
					className={Styles['receive-button']}
					onClick={handleReceiveOrder}
				>
					Получить заказ
				</button>
			)}
			{today && isReceived && (
				<div className={Styles['received-badge']}>✓ Заказ получен</div>
			)}
		</div>
	);
};

export default Order;
