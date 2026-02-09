'use client';

import React, { useState } from 'react';
import MealsTable from '@/app/components/admin/EditData/MealsTable/MealsTable';
import DishesTable from '@/app/components/admin/EditData/DishesTable/DishesTable';
import IngredientsTable from '@/app/components/admin/EditData/IngredientsTable/IngredientsTable';
import MealEditModal from '@/app/components/admin/EditData/MealEditModal/MealEditModal';
import DishEditModal from '@/app/components/admin/EditData/DishEditModal/DishEditModal';
import IngredientEditModal from '@/app/components/admin/EditData/IngredientEditModal/IngredientEditModal';
import Styles from './page.module.css';
import { useGetAllDishesQuery } from '../tools/redux/api/dishes';
import { useGetAllMealsQuery } from '../tools/redux/api/meals';
import { useGetAllIngredientsQuery } from '../tools/redux/api/ingredients';
import { IMeal } from '../tools/types/meals';
import { IDish } from '../tools/types/dishes';
import { IIngredient } from '../tools/types/ingredients';

const Page = () => {
	const {
		data: meals,
		isLoading: mealsLoading,
		refetch: refetchMeals,
	} = useGetAllMealsQuery();
	const {
		data: dishes,
		isLoading: dishesLoading,
		refetch: refetchDishes,
	} = useGetAllDishesQuery();
	const {
		data: ingredients,
		isLoading: ingredientsLoading,
		refetch: refetchIngredients,
	} = useGetAllIngredientsQuery();

	const refetch = {
		dishes: refetchDishes,
		meals: refetchMeals,
		ingredients: refetchIngredients,
	};

	const [selectedMeal, setSelectedMeal] = useState<IMeal | null>(null);
	const [selectedDish, setSelectedDish] = useState<IDish | null>(null);
	const [selectedIngredient, setSelectedIngredient] =
		useState<IIngredient | null>(null);

	function handleClose<Type>(
		type: 'meals' | 'dishes' | 'ingredients',
		closePopup: (_: Type | null) => void,
		updated: boolean,
	) {
		closePopup(null);
		if (updated) setTimeout(() => refetch[type](), 100);
	}

	return (
		<div className={Styles.container}>
			<h1 className={Styles.title}>Управление данными</h1>
			<div className={Styles.tables}>
				{mealsLoading ? (
					<p className={Styles['loading']}>Загрузка...</p>
				) : typeof meals === 'undefined' ? (
					<p>Ошибка загрузки</p>
				) : (
					<MealsTable meals={meals.meals} onRowClick={setSelectedMeal} />
				)}
				{dishesLoading ? (
					<p className={Styles['loading']}>Загрузка...</p>
				) : typeof dishes === 'undefined' ? (
					<p>Ошибка загрузки</p>
				) : (
					<DishesTable dishes={dishes.data} onRowClick={setSelectedDish} />
				)}
				{ingredientsLoading ? (
					<p className={Styles['loading']}>Загрузка...</p>
				) : typeof ingredients === 'undefined' ? (
					<p>Ошибка загрузки</p>
				) : (
					<IngredientsTable
						ingredients={ingredients.data}
						onRowClick={setSelectedIngredient}
					/>
				)}
			</div>
			{selectedMeal &&
				(typeof dishes === 'undefined' ? (
					<p>Ошибка загрузки</p>
				) : (
					<MealEditModal
						meal={selectedMeal}
						onClose={update => handleClose('meals', setSelectedMeal, update)}
						dishes={dishes.data}
					/>
				))}
			{selectedDish &&
				(typeof ingredients === 'undefined' ? (
					<p>Ошибка загрузки</p>
				) : (
					<DishEditModal
						ingredients={ingredients.data}
						id={selectedDish.id}
						onClose={update => handleClose('dishes', setSelectedDish, update)}
					/>
				))}
			{selectedIngredient && (
				<IngredientEditModal
					ingredient={selectedIngredient}
					onClose={update =>
						handleClose('ingredients', setSelectedIngredient, update)
					}
				/>
			)}
		</div>
	);
};

export default Page;
