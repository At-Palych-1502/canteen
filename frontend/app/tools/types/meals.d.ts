import { IDish } from './dishes';

export interface IMeal {
	name: string;
	price: number;
	day_of_week: string;
	quantity: number;

	dishes: IDish[];
}
