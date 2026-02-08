import React from 'react';
import Styles from '../page.module.css';
import DaySelector from '../../components/student/Menu/DaySelector/DaySelector';
import ComplexMeals from '../../components/student/Menu/ComplexMeals/ComplexMeals';
import { getDailyMeals } from '@/app/tools/mockData';
import { IComplexMeal } from '@/app/tools/types/mock';

interface Props {
	selectedDay: number;
	selectedMeals: IComplexMeal[];
	onDayChange: (day: number) => void;
	onMealSelect: (mealId: string) => void;
}

export const MealSelectionSection: React.FC<Props> = ({
	selectedDay,
	selectedMeals,
	onDayChange,
	onMealSelect,
}) => {
	const getDayName = (day: number): string => {
		const days = [
			'Понедельник',
			'Вторник',
			'Среда',
			'Четверг',
			'Пятница',
			'Суббота',
			'Воскресенье',
		];
		return days[day];
	};

	const dailyMeals = getDailyMeals(selectedDay);
	const meals = [dailyMeals.breakfast, dailyMeals.lunch];

	return (
		<div className={Styles['dishes-section']}>
			<div className={Styles['dishes-header']}>
				<h2>Выберите день недели</h2>
				<p className={Styles['hint']}>
					Выберите день для заказа комплексных обедов
				</p>
			</div>
			<DaySelector selectedDay={selectedDay} onDayChange={onDayChange} />
			<div className={Styles['dishes-header']}>
				<h2>Комплексные обеды на {getDayName(selectedDay)}</h2>
				<p className={Styles['hint']}>
					Выберите комплексные обеды (можно несколько)
				</p>
			</div>
			<ComplexMeals
				meals={meals}
				selectedMealIds={selectedMeals.map(m => m.id)}
				onSelectMeal={onMealSelect}
			/>
		</div>
	);
};
