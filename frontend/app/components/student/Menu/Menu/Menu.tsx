import React, { useState, useEffect } from 'react';
import Styles from './Menu.module.css';
import DaySelector from '../DaySelector/DaySelector';
import ComplexMeals from '../ComplexMeals/ComplexMeals';
import { getDailyMeals } from '@/app/tools/mockData';
import { IComplexMeal } from '@/app/tools/types/mock';
import { useDispatch } from 'react-redux';
import { SetOrderCount } from '@/app/tools/redux/user';
import {
	clearComplexOrder,
	getCurrentComplexOrder,
	saveAllComplexMealsToOrder,
} from '@/app/tools/utils/order';

const Menu = () => {
	const dispatch = useDispatch();
	const [selectedDay, setSelectedDay] = useState<number>(0);
	const [selectedMeals, setSelectedMeals] = useState<string[]>([]);

	// Автоматически выбираем сегодняшний день при загрузке страницы
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const today = new Date();
			const adjustedToday = today.getDay() === 0 ? 6 : today.getDay() - 1;
			setSelectedDay(adjustedToday);
		}
	}, []);

	// Загружаем выбранные комплексные обеды из localStorage при загрузке
	useEffect(() => {
		const complexOrder = getCurrentComplexOrder();
		if (complexOrder && complexOrder.items) {
			setSelectedMeals(complexOrder.items.map(item => item.mealId));
		}
	}, []);

	// Обновляем бейдж в Header при изменении количества выбранных обедов
	useEffect(() => {
		dispatch(SetOrderCount(selectedMeals.length));
	}, [selectedMeals.length, dispatch]);

	const handleMealSelect = (mealId: string) => {
		// Переключаем выбор комплексного обеда (toggle)
		setSelectedMeals(prev => {
			const isSelected = prev.includes(mealId);
			let newSelected: string[];

			if (isSelected) {
				// Если обед уже выбран, отжимаем его
				newSelected = prev.filter(id => id !== mealId);
			} else {
				// Если обед не выбран, выбираем его (можно выбрать несколько)
				newSelected = [...prev, mealId];
			}

			// Сохраняем выбранные обеды в localStorage
			if (newSelected.length > 0) {
				const dailyMeals = getDailyMeals(selectedDay);
				const meals = [dailyMeals.breakfast, dailyMeals.lunch];
				// Сохраняем все выбранные обеды сразу
				const selectedMealsObjects = newSelected
					.map(id => meals.find(m => m.id === id))
					.filter((m): m is IComplexMeal => m !== undefined);
				saveAllComplexMealsToOrder(
					selectedMealsObjects,
					selectedDay,
					dailyMeals.date,
				);
			} else {
				clearComplexOrder();
			}

			return newSelected;
		});
	};

	const dailyMeals = getDailyMeals(selectedDay);
	const meals = [dailyMeals.breakfast, dailyMeals.lunch];

	return (
		<div className={Styles['menu-container']}>
			<header>
				<h2>Меню</h2>
			</header>
			<div className={Styles['container']}>
				<div className={Styles['day-selector-wrapper']}>
					<DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
				</div>
				<div className={Styles['meals-wrapper']}>
					<h3 className={Styles['day-title']}>
						Комплексные обеды на {dailyMeals.date}
					</h3>
					<ComplexMeals
						meals={meals}
						selectedMealIds={selectedMeals}
						onSelectMeal={handleMealSelect}
					/>
				</div>
			</div>
		</div>
	);
};

export default Menu;
