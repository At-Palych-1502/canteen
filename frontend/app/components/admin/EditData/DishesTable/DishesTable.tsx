import React from 'react';
import Styles from './DishesTable.module.css';
import { IDish } from '@/app/tools/types/dishes';

interface DishesTableProps {
	dishes: IDish[];
	onRowClick: (dish: IDish) => void;
}

const DishesTable: React.FC<DishesTableProps> = ({ dishes, onRowClick }) => {
	return (
		<div className={Styles.container}>
			<h3 className={Styles.title}>Блюда</h3>
			<table className={Styles.table}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Название</th>
					</tr>
				</thead>
				<tbody>
					{dishes.map(dish => (
						<tr
							key={dish.id}
							onClick={() => onRowClick(dish)}
							className={Styles.row}
						>
							<td>{dish.id}</td>
							<td>{dish.name}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DishesTable;
