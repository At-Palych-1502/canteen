'use client';

import React from 'react';
import Styles from './ComplexMeals.module.css';
import { IComplexMeal } from '@/app/tools/types/mock';

interface Props {
	meals: IComplexMeal[];
	selectedMealIds: string[];
	onSelectMeal: (mealId: string) => void;
}

const ComplexMeals: React.FC<Props> = ({
	meals,
	selectedMealIds,
	onSelectMeal,
}) => {
	return (
		<div className={Styles['complex-meals-container']}>
			{meals.map(meal => (
				<div
					key={meal.id}
					className={`${Styles['complex-meal-card']} ${
						selectedMealIds.includes(meal.id) ? Styles.selected : ''
					}`}
				>
					<div className={Styles['meal-header']}>
						<h3 className={Styles['meal-name']}>{meal.name}</h3>
						<span className={Styles['meal-price']}>{meal.price} ₽</span>
					</div>
					<p className={Styles['meal-description']}>{meal.description}</p>
					<div className={Styles['meal-dishes']}>
						<h4 className={Styles['dishes-title']}>Состав:</h4>
						<ul className={Styles['dishes-list']}>
							{meal.dishes.map(dish => (
								<li key={dish.id} className={Styles['dish-item']}>
									<span className={Styles['dish-name']}>{dish.name}</span>
									<span className={Styles['dish-weight']}>{dish.weight} г</span>
								</li>
							))}
						</ul>
					</div>
					<div className={Styles['meal-meta']}>
						<span className={Styles['meal-calories']}>
							🔥 {meal.calories} ккал
						</span>
					</div>
					<button
						className={Styles['select-button']}
						onClick={() => onSelectMeal(meal.id)}
					>
						{selectedMealIds.includes(meal.id) ? 'Выбрано' : 'Выбрать'}
					</button>
				</div>
			))}
		</div>
	);
};

export default ComplexMeals;
