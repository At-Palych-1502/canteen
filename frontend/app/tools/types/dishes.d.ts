export interface IDishArg {
	name: string;
	weight: number;
	quantity: number;
}

export interface IDishRes extends IDishArg {
	id: number;
}

export interface IDishUpdate {
	id: number;
	data: Partial<IDishArg>;
}

export interface IDish extends IDishArg {
	id: number;
}
