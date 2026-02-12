import { IMeal } from './meals';
import { IOrder } from '@/app/tools/types/mock';

export interface IOrderCreateArg {
	meals: number[];
	payment_type: 'subscription' | 'balance';
}

export interface IOrder {
	id: number;
	user_id: number;
	date: string;
	meals: IMeal[];
}

export interface IGetAllOrders {
	data: IOrder[];
}

export interface IGetOrderById {
	order: IOrder;
}

export interface ICreateReportArg {
	days: 1 | 3 | 7;
}
