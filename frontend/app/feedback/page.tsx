'use client';

import React, { useEffect, useState } from 'react';
import Styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectUser } from '../tools/redux/user';
import { useGetAllDishesQuery } from '../tools/redux/api/dishes';
import { IAddReview, IGetReview } from '../tools/types/reviews';
import { IFeedback } from '../tools/types/mock';
import { useAddReviewMutation, useGetReviewsByUserQuery } from '../tools/redux/api/reviews';
import { Notification } from '../components/Notification/Notification';
import { FeadBackForm } from './FeadBackForm';

export default function FeedbackPage() {
	const [submitted, setSubmitted] = useState(false);
	const [notification, setNotification] = useState({ isOpen: false, ok: false, text: "" });
	const userFeedbacks = useGetReviewsByUserQuery();	

	const router = useRouter();
	const User = useSelector(selectUser);

	useEffect(() => {
		if (!User || User.role !== 'student') router.push('/');
	}, [User, router]);

	const showNotification = (ok: boolean, text: string) => setNotification({ isOpen: true, ok, text });

	const onSubmit = () => {
		setSubmitted(true);
		userFeedbacks.refetch();
	}

	const handleBackToForm = () => {
		setSubmitted(false);
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
		<>
		<div className={Styles['feedback-container']}>
			<div className={Styles['page-header']}>
				<h1>Отзывы о блюдах</h1>
				<p>Поделитесь своим мнением о блюдах школьной столовой</p>
			</div>

			<div className={Styles['feedback-form']}>
				<div className={Styles['form-header']}>
					<h2>Оставить отзыв</h2>
				</div>
				<FeadBackForm onSubmit={onSubmit} showNotification={showNotification} />
			</div>

			<div className={Styles['feedbacks-list']}>
				<div className={Styles['feedbacks-header']}>
					<h2>Мои отзывы</h2>
				</div>
				{!userFeedbacks?.isLoading ? (
					userFeedbacks?.data?.reviews?.map((feedback: IGetReview) => (
						<div key={feedback.id} className={Styles['feedback-card']}>
							<div className={Styles['feedback-header']}>
								<span className={Styles['feedback-dish-name']}>
									{feedback?.dish?.name}
								</span>
							</div>
							<div className={Styles['feedback-rating']}>
								{[1, 2, 3, 4, 5].map(star => (
									<span
										key={star}
										className={`${Styles.star} ${
											star <= feedback.score ? '' : Styles.inactive
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
		
		{notification.isOpen && (
			<Notification
				ok={notification.ok}
				text={notification.text}
				close={() => setNotification({ isOpen: false, ok: false, text: "" })}
			/>
		)}

		</>
	);
}
