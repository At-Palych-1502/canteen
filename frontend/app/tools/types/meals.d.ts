import { IDish } from './dishes';

export interface IMealCreateArg {
	dishes: number[];
	name: string;
	price: number;
	type: 'breakfast' | 'lunch';
	day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
}

export interface IMeal {
	name: string;
	price: number;
	day_of_week: string;
	quantity: number;

	dishes: IDish[];
}




<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
export type IMealUpdateReq = {
	id: number;
	data: Partial<IMealCreateArg>;
};

export interface IMealsGet {
	meals: IMeal[];
}
