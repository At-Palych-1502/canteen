import { IIngredient } from './ingredients';

export interface IDishArg {
	name: string;
	weight: number;
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
