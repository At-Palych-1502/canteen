import React from 'react';
import Styles from './IngredientsTable.module.css';

interface Ingredient {
	id: number;
	name: string;
}

interface IngredientsTableProps {
	ingredients: Ingredient[];
	onRowClick: (ingredient: Ingredient) => void;
}

const IngredientsTable: React.FC<IngredientsTableProps> = ({
	ingredients,
	onRowClick,
}) => {
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
		</div>
	);
};

export default IngredientsTable;
