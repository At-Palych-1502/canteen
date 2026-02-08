import { IDish } from './dishes';

export interface IMeal {
	name: string;
	price: number;
	date: string;

	dishes: IDish[];
}
