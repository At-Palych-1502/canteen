'use client';

import React, { useState, useEffect } from 'react';
import Styles from './page.module.css';
import { OptionCard } from './components/OptionCard';
import { SubscriptionTypeSelector } from './components/SubscriptionTypeSelector';
import { OrderSection } from './components/OrderSection';
import {
	clearComplexOrder,
	getCurrentComplexOrder,
} from '@/app/tools/utils/order';
import ComplexMeals from '../components/student/Menu/ComplexMeals/ComplexMeals';
import DaySelector from '../components/student/Menu/DaySelector/DaySelector';
import { useGetAllMealsQuery } from '../tools/redux/api/meals';
import { IMeal } from '../tools/types/meals';
import { useCreateOrderMutation } from '../tools/redux/api/orders';
import { useSelector } from 'react-redux';
import { selectUser } from '../tools/redux/user';
import { useAddSubscriptionMutation, useGetBalanceQuery, useGetSubscriptionsQuery } from '../tools/redux/api/business';
import { Notification } from '../components/Notification/Notification';

type SubscriptionType = 'breakfast' | 'lunch' | 'breakfast-lunch';

export default function BuyPage() {
	// const status useProtectedPage('student');

	const [selectedOption, setSelectedOption] = useState<number>(1);
	const [selectedMeals, setSelectedMeals] = useState<number[]>([]);
	const [selectedDay, setSelectedDay] = useState<number>(0);
	const [orderPlaced, setOrderPlaced] = useState(false);
	const [orderPrice, setOrderPrice] = useState(0);
	const [isButtonOrderDisabled, setIsButtonOrderDisabled] = useState(false);
	const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>('breakfast');

	const [notification, setNotification] = useState({ isOpen: false, ok: false, text: "" });
	const showNotification = (ok: boolean, text: string) => setNotification({ isOpen: true, ok, text });

	const User = useSelector(selectUser);
	const {
		data: balance,
		isLoading: isBalanceLoading,
		refetch: refetchBalance
	} = useGetBalanceQuery();
	const {
		data: meals,
		isLoading: isMealsLoading,
		refetch: refetchMeals
	} = useGetAllMealsQuery();
	const {
		data: subs,
		isLoading: isSubsLoading,
		refetch: refetchSubs
	} = useGetSubscriptionsQuery();
	const [createOrder] = useCreateOrderMutation();
	const [addSub] = useAddSubscriptionMutation();

	const onSubscription = async() => {
		setIsButtonOrderDisabled(true);
		if (selectedMeals.length !== 1)
			return; 

		const res = await createOrder({ 
			meal_id: selectedMeals[0],
			date: getNextDayOfWeek(selectedDay === 6 ? 0 : selectedDay + 1).toJSON(),
			payment_type: "subscription"
		});
		if (res.error) {
			showNotification(false, "Неизвестная ошибка");
		} else {
			showNotification(true, "Успешно");
		}

		refetchSubs();
		refetchBalance();
		refetchMeals();
		setSelectedMeals([]);
		setIsButtonOrderDisabled(false);
	}


	// Автоматически выбираем сегодняшний день при загрузке страницы
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const today = new Date();
			const adjustedToday = today.getDay() === 0 ? 6 : today.getDay() - 1;
			setSelectedDay(adjustedToday);
		}
	}, []);

	useEffect(() => {
		setOrderPrice(countPrice());

		if ((balance?.balance || balance?.balance === 0) && countPrice() > balance.balance) {
			showNotification(false, "Недостаточно средств!");
		}
	}, [selectedMeals]);

	useEffect(() => {
		setSelectedMeals([]);
	}, [selectedDay])

	useEffect(() => {
		if (selectedOption === 1) {
			setOrderPrice(0);
		}
		else if (selectedOption === 2) {
			setOrderPrice(2500);
		}
		else {
			setOrderPrice(4500);
		}
	}, [selectedOption]);

	const handleBackToMenu = () => {
		setOrderPlaced(false);
		setSelectedOption(1);
		setSelectedMeals([]);
		clearComplexOrder();
	};

	const handleMealSelect = (id: number) => {
		if (selectedMeals.find(v => v === id)) {
			setSelectedMeals(selectedMeals.filter(v => v !== id));
		} else {
			const temp = selectedMeals.map(v => v);
			temp.push(id);
			setSelectedMeals(temp);
		}
	}

	const countPrice = () => {
		let sum = 0;
		selectedMeals.forEach(id => {
			const meal = meals?.meals.find(m => m.id === id);
			sum += meal?.price ?? 0;
		});
		return sum;
	}

	function getNextDayOfWeek(targetDay: number): Date {
		const now = new Date();
		const currentDay = now.getDay(); // 0 (вс) ... 6 (сб)
		const daysAhead = (targetDay - currentDay + 7) % 7;

		const nextDate = new Date(now);
		nextDate.setDate(now.getDate() + daysAhead);
		return nextDate;
	}

	const isPosibleSub = () => {
		console.log(subs);
		if (selectedMeals.length === 1) {
			const type = meals?.meals?.find(m => m.id === selectedMeals[0])?.type;
			if (subs?.subscriptions?.find(s => s.type === type)) {
				return true
			}
		}

		return false;
	}

	const handleOrder = async() => {
		setIsButtonOrderDisabled(true);
		let isSucces = true;

		if (selectedOption === 1) {
			for (let i = 0; i < selectedMeals.length; i++) {
				const id = selectedMeals[i];
				const res = await createOrder({ 
					meal_id: id,
					date: getNextDayOfWeek(selectedDay === 6 ? 0 : selectedDay + 1).toJSON(),
					payment_type: "balance"
				});
				if (res.error) {
					isSucces = false;
					showNotification(false, "Неизвестная ошибка");
					break;
				}
			}
		} else {
			const data = selectedOption === 2 ? ({
				type: 'breakfast',
				price: 2500
			}) : ({
				type: 'lunch',
				price: 4500
			});
			const res = await addSub(data);
			isSucces = res.error !== null;
		}
		
		
		if (isSucces)
			showNotification(true, "Успешно!");

		refetchSubs();
		refetchBalance();
		refetchMeals();
		setSelectedMeals([]);
		setIsButtonOrderDisabled(false);
	}

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

	if (orderPlaced) {
		return (
			<div className={Styles['buy-container']}>
				<div className={Styles['success-message']}>
					<h2>Заказ успешно оформлен!</h2>
					{/* {selectedOption?.type === 'single' ? (
						<p>
							Вы заказали {selectedMeals.length} комплексных обедов на{' '}
							{getDayName(selectedDay)} сумму {getTotalPrice()} ₽
						</p>
					) : (
						<p>
							Вы приобрели: {selectedOption?.name} {selectedOption?.period}
						</p>
					)} */}
					<button onClick={handleBackToMenu}>Вернуться к выбору</button>
				</div>
			</div>
		);
	}

	// const dailyMeals = getDailyMeals(selectedDay);
	// const meals = [dailyMeals.breakfast, dailyMeals.lunch];

	return (
		<div className={Styles['buy-container']}>
			<div className={Styles['page-header']}>
				<div className={Styles['header-content']}>
					<div>
						<h1>Покупка питания</h1>
						<p>Выберите удобный вариант оплаты питания</p>
					</div>
					{/* {selectedOption?.type === 'single' && selectedMeals.length > 0 && (
						<div className={Styles['badge']}>{selectedMeals.length}</div>
					)} */}
				</div>
			</div>

			<div className={Styles['options-grid']}>
				{[ { id: 1, name: "Разовый приём пищи", description: "Оплата одного приема пищи" }, { id: 2, name: "Абонемент 20 дней ЗАВТРАКИ", description: "В течение 20 дней можно оплачивать по 1 приёму пищи" }, { id: 3, name: "Абонемент 20 дней ОБЕДЫ", description: "В течение 20 дней можно оплачивать по 1 приёму пищи" }].map(option => (
					<OptionCard
						key={option.id}
						id={option.id}
						name={option.name}
						description={option.description}
						isSelected={selectedOption === option.id}
						onClick={() => setSelectedOption(option.id)}
					/>
				))}
			</div>

			{/* Выбор типа абонемента
			{selectedOption?.type !== 'single' && (
				<SubscriptionTypeSelector
					subscriptionType={subscriptionType}
					onSubscriptionTypeChange={setSubscriptionType}
				/>
			)} */}

			{selectedOption === 1 && !isMealsLoading && meals && (
				<div className={Styles['dishes-section']}>
					<div className={Styles['dishes-header']}>
						<h2>Выберите день недели</h2>
						<p className={Styles['hint']}>
							Выберите день для заказа комплексных обедов
						</p>
					</div>
					<DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />

					<div className={Styles['dishes-header']}>
						<h2>Комплексные завтраки/обеды на {getDayName(selectedDay)}</h2>
						<p className={Styles['hint']}>
							Выберите комплексные завтраки/обеды (можно несколько)
						</p>
					</div>
					<ComplexMeals
						meals={meals}
						selectedMealIds={selectedMeals}
						onSelectMeal={handleMealSelect}
						selectedDay={selectedDay}
					/>
				</div>
			)}

			{selectedOption && (
				<OrderSection
					totalPrice={orderPrice}
					summaryText={`Выбрано: ${selectedMeals.length}`}
					onOrder={handleOrder}
					disabled={
						(selectedMeals.length === 0 && selectedOption === 1) || !balance?.balance || orderPrice > balance?.balance || isButtonOrderDisabled
					}
					balance={balance?.balance ?? 0}
					isSub={isPosibleSub() && !isButtonOrderDisabled}
					onSubscription={onSubscription}
				/>
			)}

			{notification.isOpen && (
				<Notification
					close={() => setNotification({ isOpen: false, ok: false, text: "" })}
					ok={notification.ok}
					text={notification.text}
					/>
			)}
		</div>
	);
}
