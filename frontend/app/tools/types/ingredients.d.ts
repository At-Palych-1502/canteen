export interface IIngredientArg {
	name: string;
}

export interface IIngredientRes extends IIngredientArg {
	id: number;
}

export interface IIngredientUpdate {
	id: number;
	data: Partial<IIngredientArg>;
}

export interface IIngredient extends IIngredientArg {
	id: number;
	quantity: number;
}

export interface IGetAllIngredients {
	data: IIngredient[];
}
