import { IIngredient } from './ingredients';

export interface IDishArg {
	name: string;
	weight: number;
	ingredients: number[];
}

export interface IDishRes extends IDishArg {
	id: number;
}

export interface IDishUpdate {
	id: number;
	data: Partial<IDishUpdateReq>;
}

export interface IDishUpdateReq extends Partial<IDishArg> {
	ingredients?: IIngredient[] | number[];
}

export interface IDish extends IDishArg {
	id: number;
	ingredients?: IIngredient[];
}

export interface IGetDishRes {
	data: IDish;
}

export interface IAddIngredientArg {
	dishId: number;
	ingredientId: number;
}

export interface IGetAllDishes {
	data: IDish[];
}

export interface IOffQuantity {
	dish_id: number;
	quantity: number;
}

export interface IUpQuantity {
	dish_id: number;
	quantity: number;
	off_ingredients: number[];
}

export interface IChangeQuantityRes {
	dish: IDish;
}
