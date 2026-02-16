import { IMeal } from './meals';

export interface IOrderCreateArg {
	meal_id: number;
	date: string
	payment_type: 'subscription' | 'balance';
}

export interface IOrder {
	id: number;
	user_id: number;
	date: string;
	meal: IMeal;
	is_given: boolean
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

export interface ISubscription {
	id: number,
	user_id: number,
	type: string,
	duration: number
}

export interface INotice {
	created_at: string,
	title: string,
	message: string,
	id: number
}