import React from 'react';
import Styles from './MealsTable.module.css';
import { days, daysIndex } from '@/app/config/format';

interface MealsTableProps {
	onRowClick: (day: number) => void;
}

const MealsTable: React.FC<MealsTableProps> = ({ onRowClick }) => {
	return (
		<div className={Styles.container}>
			<h3 className={Styles.title}>Еда</h3>
			<table className={Styles.table}>
				<thead>
					<tr>
						<th>Номер</th>
						<th>День</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(days).map((day, index) => (
						<tr
							key={index}
							onClick={() => onRowClick(index)}
							className={Styles.row}
						>
							<td>{index + 1}</td>
							<td>{daysIndex[index] || 'Ошибка загрузки'}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default MealsTable;
