export interface ICreateBuyRequestArg {
	ingredient_id: number;
	quantity: number;
}

export type BuyRequestStatus = boolean | null;

export interface IBuyRequest extends ICreateBuyRequestArg {
	id: number;
	user_id: number;
	is_accepted: BuyRequestStatus;
	date: string;
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
