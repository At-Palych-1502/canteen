import { IOrder } from '@/app/tools/types/mock';
import React from 'react';

interface Props {
	order: IOrder;
}

const Order = ({ order }: Props) => {
	return <div>{order.id}</div>;
};

export default Order;
