'use client';

import React, { useState } from 'react';
import { mockDishes, getDailyMeals } from '@/app/tools/mockData';
import { IDailyMeals, IDishExtended } from '@/app/tools/types/mock';
import MealsTable from '@/app/components/admin/EditData/MealsTable/MealsTable';
import DishesTable from '@/app/components/admin/EditData/DishesTable/DishesTable';
import IngredientsTable from '@/app/components/admin/EditData/IngredientsTable/IngredientsTable';
import MealEditModal from '@/app/components/admin/EditData/MealEditModal/MealEditModal';
import DishEditModal from '@/app/components/admin/EditData/DishEditModal/DishEditModal';
import IngredientEditModal from '@/app/components/admin/EditData/IngredientEditModal/IngredientEditModal';
import Styles from './page.module.css';

interface Ingredient {
	id: number;
	name: string;
}

const Page = () => {
	const [selectedMeal, setSelectedMeal] = useState<IDailyMeals | null>(null);
	const [selectedDish, setSelectedDish] = useState<IDishExtended | null>(null);
	const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

	const weekMeals: IDailyMeals[] = Array.from({ length: 7 }, (_, i) => getDailyMeals(i));

	const ingredients: Ingredient[] = [
		{ id: 1, name: 'Морковь' },
		{ id: 2, name: 'Картофель' },
		{ id: 3, name: 'Лук репчатый' },
		{ id: 4, name: 'Мука пшеничная' },
		{ id: 5, name: 'Сахар' },
		{ id: 6, name: 'Масло подсолнечное' },
		{ id: 7, name: 'Яйца' },
		{ id: 8, name: 'Молоко' },
	];

	const handleSaveMeal = (meal: IDailyMeals) => {
		console.log('Сохранение еды:', meal);
		setSelectedMeal(null);
	};

	const handleSaveDish = (dish: IDishExtended) => {
		console.log('Сохранение блюда:', dish);
		setSelectedDish(null);
	};

	const handleSaveIngredient = (ingredient: Ingredient) => {
		console.log('Сохранение ингредиента:', ingredient);
		setSelectedIngredient(null);
	};

	return (
		<div className={Styles.container}>
			<h1 className={Styles.title}>Управление данными</h1>
			<div className={Styles.tables}>
				<MealsTable meals={weekMeals} onRowClick={setSelectedMeal} />
				<DishesTable dishes={mockDishes} onRowClick={setSelectedDish} />
				<IngredientsTable ingredients={ingredients} onRowClick={setSelectedIngredient} />
			</div>
			{selectedMeal && (
				<MealEditModal
					meal={selectedMeal}
					onClose={() => setSelectedMeal(null)}
					onSave={handleSaveMeal}
				/>
			)}
			{selectedDish && (
				<DishEditModal
					dish={selectedDish}
					onClose={() => setSelectedDish(null)}
					onSave={handleSaveDish}
				/>
			)}
			{selectedIngredient && (
				<IngredientEditModal
					ingredient={selectedIngredient}
					onClose={() => setSelectedIngredient(null)}
					onSave={handleSaveIngredient}
				/>
			)}
		</div>
	);
};

export default Page;
