'use client';

import React from 'react';
import Styles from './IngredientsTable.module.css';

interface Ingredient {
	id: number;
	name: string;
}

interface Props {
	ingredients: Ingredient[];
	onRowClick: (ingredient: Ingredient) => void;
	onCreate: () => void;
}

const IngredientsTable = ({ ingredients, onRowClick, onCreate }: Props) => {
	return (
		<div className={Styles.container}>
			<h3 className={Styles.title}>Ингредиенты</h3>
			<table className={Styles.table}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Название</th>
					</tr>
				</thead>
				<tbody>
					{ingredients.map(ingredient => (
						<tr
							key={ingredient.id}
							onClick={() => onRowClick(ingredient)}
							className={Styles.row}
						>
							<td>{ingredient.id}</td>
							<td>{ingredient.name}</td>
						</tr>
					))}
				</tbody>
			</table>
			<button onClick={onCreate} style={{ marginTop: '12px' }}>
				Добавить
			</button>
		</div>
	);
};

export default IngredientsTable;
