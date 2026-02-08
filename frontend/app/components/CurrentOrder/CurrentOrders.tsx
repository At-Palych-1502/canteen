import React from 'react';
import Styles from './CurrentOrder.module.css';
import { getCurrentOrders } from '@/app/tools/mockData';
import Link from 'next/link';
import Order from './Order';

const CurrentOrders = () => {
	const orders = getCurrentOrders();

	return (
		<div className={Styles['current-orders-wrapper']}>
			<h2>Текущие заказы</h2>
			{orders.length > 0 ? (
				<div className={Styles['orders']}>
					{orders.map(order => (
						<Order key={order.id} order={order} />
					))}
				</div>
			) : (
				<div className={Styles['orders-empty']}>
					<h3>У вас ещё нету заказов на питание</h3>
					<Link href={'/buy'} />
				</div>
			)}
		</div>
	);
};

export default CurrentOrders;
