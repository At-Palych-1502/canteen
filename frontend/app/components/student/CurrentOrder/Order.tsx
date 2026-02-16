import { IDish } from '@/app/tools/types/dishes';
import React, { useEffect, useState } from 'react';
import Styles from './CurrentOrder.module.css';
import { useGetAllOrdersQuery } from '@/app/tools/redux/api/orders';
import { IOrder } from '@/app/tools/types/business';

interface Props {
	order: IOrder,
	setGivenHandler: (id: number) => Promise<void>
}

const Order = ({ order, setGivenHandler }: Props) => {
	const [isReceived, setIsReceived] = useState(false);



	// Проверяем, является ли дата сегодняшней
	const isToday = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const orderDate = new Date(order.date);
		orderDate.setHours(0, 0, 0, 0);
		return today.getTime() === orderDate.getTime();
	};

	// Форматируем дату для отображения
	const formatDate = (temp: string) => {
		const date = new Date(temp);
		const options: Intl.DateTimeFormatOptions = {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		};
		return date.toLocaleDateString('ru-RU', options);
	};

	const handleReceiveOrder = async() => {
		await setGivenHandler(order.id);
		setIsReceived(true);
	};

	const today = isToday();

	return (
		<div className={Styles['order-card']}>
			<div className={Styles['order-header']}>
				<span className={Styles['order-date']}>{formatDate(order.date)}</span>
				{today && <span className={Styles['order-today-badge']}>Сегодня</span>}
			</div>
			<div className={Styles['order-meals']}>
				<div
					className={Styles['meal-item']}
				>
					<span className={Styles['meal-name']}>{order.meal.name}</span>
				</div>
			</div>

			{/* Кнопки для студента */}
			{today && !isReceived && (
				<button className={Styles['receive-button']} onClick={handleReceiveOrder}>Получить заказ</button>
			)}
			{today && isReceived && (
				<div className={Styles['received-badge']}>✓ Заказ получен</div>
			)}
		</div>
	);
};

export default Order;
