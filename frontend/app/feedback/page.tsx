'use client';

import React, { useState } from 'react';
import Styles from './page.module.css';
import { mockDishes, mockFeedbacks } from '@/app/tools/mockData';
import { IFeedback } from '@/app/tools/types/mock';

// ID текущего пользователя (в реальном приложении берется из Redux)
const CURRENT_USER_ID = 'user1';

export default function FeedbackPage() {
	const [selectedDish, setSelectedDish] = useState<string>('');
	const [rating, setRating] = useState<number>(0);
	const [comment, setComment] = useState<string>('');
	const [feedbacks, setFeedbacks] = useState<IFeedback[]>(mockFeedbacks);
	const [submitted, setSubmitted] = useState(false);

	// Фильтруем отзывы только для текущего пользователя
	const userFeedbacks = feedbacks.filter(f => f.userId === CURRENT_USER_ID);

	const handleRatingClick = (value: number) => {
		setRating(value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedDish || rating === 0) {
			alert('Пожалуйста, выберите блюдо и поставьте оценку');
			return;
		}

		const dish = mockDishes.find(d => d.id === Number(selectedDish));
		if (!dish) return;

		const newFeedback: IFeedback = {
			id: feedbacks.length + 1,
			dishId: dish.id,
			dishName: dish.name,
			rating,
			comment,
			date: new Date().toISOString().split('T')[0],
			userId: CURRENT_USER_ID,
		};

		setFeedbacks([newFeedback, ...feedbacks]);
		setSubmitted(true);

		// Сброс формы
		setSelectedDish('');
		setRating(0);
		setComment('');
	};

	const handleBackToForm = () => {
		setSubmitted(false);
	};

	const renderStars = (value: number, interactive = false) => {
		return (
			<div className={Styles['rating-group']}>
				{[1, 2, 3, 4, 5].map(star => (
					<span
						key={star}
						className={`${Styles['rating-star']} ${
							star <= value ? Styles.active : ''
						} ${interactive ? '' : Styles.star}`}
						onClick={interactive ? () => handleRatingClick(star) : undefined}
					>
						★
					</span>
				))}
			</div>
		);
	};

	if (submitted) {
		return (
			<div className={Styles['feedback-container']}>
				<div className={Styles['success-message']}>
					<h2>Отзыв успешно отправлен!</h2>
					<p>Спасибо за ваш отзыв. Мы ценим ваше мнение.</p>
					<button onClick={handleBackToForm}>Оставить еще отзыв</button>
				</div>
			</div>
		);
	}

	return (
		<div className={Styles['feedback-container']}>
			<div className={Styles['page-header']}>
				<h1>Отзывы о блюдах</h1>
				<p>Поделитесь своим мнением о блюдах школьной столовой</p>
			</div>

			<div className={Styles['feedback-form']}>
				<div className={Styles['form-header']}>
					<h2>Оставить отзыв</h2>
				</div>
				<form onSubmit={handleSubmit}>
					<div className={Styles['form-group']}>
						<label htmlFor='dish'>Выберите блюдо</label>
						<select
							id='dish'
							value={selectedDish}
							onChange={e => setSelectedDish(e.target.value)}
							required
						>
							<option value=''>Выберите блюдо...</option>
							{mockDishes
								.filter(dish => dish.available)
								.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
								.map(dish => (
									<option key={dish.id} value={dish.id}>
										{dish.name} - {dish.price} ₽
									</option>
								))}
						</select>
					</div>

					<div className={Styles['form-group']}>
						<label>Оценка</label>
						{renderStars(rating, true)}
					</div>

					<div className={Styles['form-group']}>
						<label htmlFor='comment'>Комментарий</label>
						<textarea
							id='comment'
							value={comment}
							onChange={e => setComment(e.target.value)}
							placeholder='Напишите ваш отзыв...'
						/>
					</div>

					<button type='submit' className={Styles['submit-button']}>
						Отправить отзыв
					</button>
				</form>
			</div>

			<div className={Styles['feedbacks-list']}>
				<div className={Styles['feedbacks-header']}>
					<h2>Мои отзывы</h2>
				</div>
				{userFeedbacks.length > 0 ? (
					userFeedbacks.map(feedback => (
						<div key={feedback.id} className={Styles['feedback-card']}>
							<div className={Styles['feedback-header']}>
								<span className={Styles['feedback-dish-name']}>
									{feedback.dishName}
								</span>
								<span className={Styles['feedback-date']}>{feedback.date}</span>
							</div>
							<div className={Styles['feedback-rating']}>
								{[1, 2, 3, 4, 5].map(star => (
									<span
										key={star}
										className={`${Styles.star} ${
											star <= feedback.rating ? '' : Styles.inactive
										}`}
									>
										★
									</span>
								))}
							</div>
							{feedback.comment && (
								<p className={Styles['feedback-comment']}>{feedback.comment}</p>
							)}
						</div>
					))
				) : (
					<div className={Styles['empty-state']}>У вас пока нет отзывов</div>
				)}
			</div>
		</div>
	);
}
