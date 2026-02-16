import React from 'react';
import Styles from './CurrentOrder.module.css';
import Link from 'next/link';
import Order from './Order';
import { useGetAllOrdersQuery } from '@/app/tools/redux/api/orders';

interface Props {
	role: "cook" | "student"
}

const CurrentOrders = (props: any) => {

	const {
		data: orders,
		isLoading: isOrdersLoading,
		refetch: refetchOrders
	} = useGetAllOrdersQuery();


	return (
		<div className={Styles['current-orders-wrapper']}>
			<h2>{props.role == "cook" ? "Учёт выданных заказов" : "Текущие заказы"}</h2>
			{orders?.data && orders?.data.length > 0 ? (
				<div className={Styles['orders']}>
					{orders.data.map(order => (
						<Order key={order.id} order={order} />
					))}
				</div>
			) : (
				<div className={Styles['orders-empty']}>
					<h3>У вас ещё нету заказов на питание</h3>
					<Link href={'/buy'}>Заказать питание</Link>
				</div>
			)}
		</div>
	);
};

export default CurrentOrders;
