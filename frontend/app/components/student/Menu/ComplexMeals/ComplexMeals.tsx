'use client';

import React from 'react';
import Styles from './ComplexMeals.module.css';
import { IComplexMeal } from '@/app/tools/types/mock';
import { IMeal, IMealsGet } from '@/app/tools/types/meals';

interface Props {
	meals: IMealsGet;
	selectedMealIds: number[];
	onSelectMeal: (mealId: number) => void;
	selectedDay: number
}

const ComplexMeals: React.FC<Props> = ({
	meals,
	selectedMealIds,
	onSelectMeal,
	selectedDay
}) => {
	const getStringDay = (number: number) => {
		const weekdays = [
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
			"sunday"
		];
		return weekdays[number];
	}

	return (
		<div className={Styles['complex-meals-container']}>
			{meals.meals.map(meal => {
				if (meal.day_of_week == getStringDay(selectedDay))
					return (
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
							<p className={Styles['meal-description']}>{meal.name}</p>
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
							<button
								className={Styles['select-button']}
								onClick={() => onSelectMeal(meal.id)}
							>
								{selectedMealIds.includes(meal.id) ? 'Выбрано' : 'Выбрать'}
							</button>
						</div>
					)})}
		</div>
	);
};

export default ComplexMeals;
