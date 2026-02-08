'use client';

import React, { useState, useEffect } from 'react';
import Styles from './page.module.css';
import { mockBuyOptions, getDailyMeals } from '@/app/tools/mockData';
import { IBuyOption, IComplexMeal } from '@/app/tools/types/mock';
import { OptionCard } from './components/OptionCard';
import { SubscriptionTypeSelector } from './components/SubscriptionTypeSelector';
import { OrderSection } from './components/OrderSection';
import {
	clearComplexOrder,
	getCurrentComplexOrder,
} from '@/app/tools/utils/order';
import ComplexMeals from '../components/student/Menu/ComplexMeals/ComplexMeals';
import DaySelector from '../components/student/Menu/DaySelector/DaySelector';

type SubscriptionType = 'breakfast' | 'lunch' | 'breakfast-lunch';

export default function BuyPage() {
	// const status useProtectedPage('student');

	const [selectedOption, setSelectedOption] = useState<IBuyOption | null>(null);
	const [selectedMeals, setSelectedMeals] = useState<IComplexMeal[]>([]);
	const [selectedDay, setSelectedDay] = useState<number>(0);
	const [orderPlaced, setOrderPlaced] = useState(false);
	const [subscriptionType, setSubscriptionType] =
		useState<SubscriptionType>('breakfast');

	// Автоматически выбираем сегодняшний день при загрузке страницы
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const today = new Date();
			const adjustedToday = today.getDay() === 0 ? 6 : today.getDay() - 1;
			setSelectedDay(adjustedToday);
		}
	}, []);

	// Проверяем наличие текущего заказа в localStorage при загрузке
	useEffect(() => {
		const complexOrder = getCurrentComplexOrder();
		if (complexOrder?.items && complexOrder.items.length > 0) {
			// Загружаем обеды из текущего заказа
			const dailyMeals = getDailyMeals(complexOrder.items[0].day);
			const meals = [dailyMeals.breakfast, dailyMeals.lunch];
			const selectedMealsFromOrder = complexOrder.items
				.map(item => meals.find(m => m.id === item.mealId))
				.filter((m): m is IComplexMeal => m !== undefined);
			setSelectedMeals(selectedMealsFromOrder);
			setSelectedDay(complexOrder.items[0].day);
		}
	}, []);

	// При выборе разового питания загружаем обеды из localStorage
	useEffect(() => {
		if (selectedOption?.type === 'single') {
			const complexOrder = getCurrentComplexOrder();
			if (complexOrder?.items && complexOrder.items.length > 0) {
				// Загружаем обеды из текущего заказа
				const dailyMeals = getDailyMeals(complexOrder.items[0].day);
				const meals = [dailyMeals.breakfast, dailyMeals.lunch];
				const selectedMealsFromOrder = complexOrder.items
					.map(item => meals.find(m => m.id === item.mealId))
					.filter((m): m is IComplexMeal => m !== undefined);
				setSelectedMeals(selectedMealsFromOrder);
				setSelectedDay(complexOrder.items[0].day);
			}
		}
	}, [selectedOption?.type]);

	const handleOptionClick = (option: IBuyOption) => {
		setSelectedOption(option);
		// Если выбран разовый обед и в localStorage есть выбранные обеды, не сбрасываем их
		if (option.type !== 'single') {
			setSelectedMeals([]);
		}
	};

	const handleMealSelect = (mealId: string) => {
		const dailyMeals = getDailyMeals(selectedDay);
		const meals = [dailyMeals.breakfast, dailyMeals.lunch];
		const meal = meals.find(m => m.id === mealId);

		if (meal) {
			setSelectedMeals(prev => {
				const isSelected = prev.some(m => m.id === mealId);
				if (isSelected) {
					return prev.filter(m => m.id !== mealId);
				} else {
					return [...prev, meal];
				}
			});
		}
	};

	const handleOrder = () => {
		if (selectedOption?.type === 'single' && selectedMeals.length === 0) {
			alert('Пожалуйста, выберите хотя бы один комплексный обед');
			return;
		}

		// Здесь будет логика отправки заказа на сервер
		console.log('Order placed:', {
			selectedOption,
			selectedMeals,
			selectedDay,
			subscriptionType,
		});
		setOrderPlaced(true);
	};

	const handleBackToMenu = () => {
		setOrderPlaced(false);
		setSelectedOption(null);
		setSelectedMeals([]);
		clearComplexOrder();
	};

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

	const getTotalPrice = (): number => {
		if (selectedOption?.type !== 'single') {
			return selectedOption?.price || 0;
		}
		return selectedMeals.reduce((sum, meal) => sum + meal.price, 0);
	};

	if (orderPlaced) {
		return (
			<div className={Styles['buy-container']}>
				<div className={Styles['success-message']}>
					<h2>Заказ успешно оформлен!</h2>
					{selectedOption?.type === 'single' ? (
						<p>
							Вы заказали {selectedMeals.length} комплексных обедов на{' '}
							{getDayName(selectedDay)} сумму {getTotalPrice()} ₽
						</p>
					) : (
						<p>
							Вы приобрели: {selectedOption?.name} {selectedOption?.period}
						</p>
					)}
					<button onClick={handleBackToMenu}>Вернуться к выбору</button>
				</div>
			</div>
		);
	}

	const totalPrice = getTotalPrice();
	const dailyMeals = getDailyMeals(selectedDay);
	const meals = [dailyMeals.breakfast, dailyMeals.lunch];

	return (
		<div className={Styles['buy-container']}>
			<div className={Styles['page-header']}>
				<div className={Styles['header-content']}>
					<div>
						<h1>Покупка питания</h1>
						<p>Выберите удобный вариант оплаты питания</p>
					</div>
					{selectedOption?.type === 'single' && selectedMeals.length > 0 && (
						<div className={Styles['badge']}>{selectedMeals.length}</div>
					)}
				</div>
			</div>

			<div className={Styles['options-grid']}>
				{mockBuyOptions.map(option => (
					<OptionCard
						key={option.id}
						option={option}
						isSelected={selectedOption?.id === option.id}
						onClick={() => handleOptionClick(option)}
					/>
				))}
			</div>

			{/* Выбор типа абонемента */}
			{selectedOption?.type !== 'single' && (
				<SubscriptionTypeSelector
					subscriptionType={subscriptionType}
					onSubscriptionTypeChange={setSubscriptionType}
				/>
			)}

			{/* Если выбран разовый обед, показываем выбор обедов */}
			{selectedOption?.type === 'single' && (
				<div className={Styles['dishes-section']}>
					<div className={Styles['dishes-header']}>
						<h2>Выберите день недели</h2>
						<p className={Styles['hint']}>
							Выберите день для заказа комплексных обедов
						</p>
					</div>
					<DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />

					<div className={Styles['dishes-header']}>
						<h2>Комплексные обеды на {getDayName(selectedDay)}</h2>
						<p className={Styles['hint']}>
							Выберите комплексные обеды (можно несколько)
						</p>
					</div>
					<ComplexMeals
						meals={meals}
						selectedMealIds={selectedMeals.map(m => m.id)}
						onSelectMeal={handleMealSelect}
					/>
				</div>
			)}

			{selectedOption && (
				<OrderSection
					totalPrice={totalPrice}
					summaryText={
						selectedOption.type === 'single'
							? selectedMeals.length > 0
								? `${selectedMeals.length} комплексных обедов на ${getDayName(
										selectedDay,
									)}`
								: 'Не выбрано'
							: selectedOption.name
					}
					onOrder={handleOrder}
					disabled={
						selectedOption.type === 'single' && selectedMeals.length === 0
					}
				/>
			)}
		</div>
	);
}
