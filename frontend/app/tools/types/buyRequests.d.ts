import { IIngredient } from './ingredients';
import { IUser } from './user';

export interface ICreateBuyRequestArg {
	ingredient_id: number;
	quantity: number;
}

export type BuyRequestStatus = boolean | null | 'pending';

export interface IBuyRequest extends ICreateBuyRequestArg {
	id: number;
	user: IUser;
	is_accepted: BuyRequestStatus;
	date: string;
	ingredient: IIngredient;
	ingredient_id: undefined;
}

export interface IGetAllBuyRequestRes {
	purchase_requests: BuyRequest[];
}

export interface ICreateBuyRequestRes {
	purchase_req: BuyRequest;
}

export interface IUpdateBuyRequest {
	id: number;
	data: Partial<IBuyRequest>;
}
