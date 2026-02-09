import React from 'react';
import Styles from './MealsTable.module.css';
import { IMeal } from '@/app/tools/types/meals';
import { days } from '@/app/config/format';

interface MealsTableProps {
	meals: IMeal[];
	onRowClick: (meal: IMeal) => void;
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
							key={meal.id}
							onClick={() => onRowClick(meal)}
							className={Styles.row}
						>
							<td>{meal.id}</td>
							<td>{days[meal.day_of_weak]}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default MealsTable;
