import React from 'react';
import { IDailyMeals } from '@/app/tools/types/mock';
import Styles from './MealsTable.module.css';

interface MealsTableProps {
	meals: IDailyMeals[];
	onRowClick: (meal: IDailyMeals) => void;
}

const MealsTable: React.FC<MealsTableProps> = ({ meals, onRowClick }) => {
	return (
		<div className={Styles.container}>
			<h3 className={Styles.title}>Еда</h3>
			<table className={Styles.table}>
				<thead>
					<tr>
						<th>ID</th>
						<th>День</th>
					</tr>
				</thead>
				<tbody>
					{meals.map(meal => (
						<tr
							key={meal.day}
							onClick={() => onRowClick(meal)}
							className={Styles.row}
						>
							<td>{meal.day}</td>
							<td>{meal.date}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default MealsTable;
