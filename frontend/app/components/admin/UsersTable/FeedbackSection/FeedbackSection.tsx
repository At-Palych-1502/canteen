import React from 'react';
import { mockFeedbacks } from '../../../../tools/mockData';
import Styles from './FeedbackSection.module.css';

const FeedbackSection = () => {
	// const {data: feedbacks, isLoading} = useGetR

	const sortedFeedbacks = [...mockFeedbacks].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	return (
		<div className={Styles.container}>
			<h2 className={Styles.title}>Отзывы</h2>
			<div className={Styles.feedbacksList}>
				{sortedFeedbacks.map(feedback => (
					<div key={feedback.id} className={Styles.feedbackCard}>
						<div className={Styles.feedbackHeader}>
							<span className={Styles.dishName}>{feedback.dishName}</span>
							<span className={Styles.rating}>
								{'★'.repeat(feedback.rating)}
								{'☆'.repeat(5 - feedback.rating)}
							</span>
						</div>
						<p className={Styles.comment}>{feedback.comment}</p>
						<span className={Styles.date}>{feedback.date}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default FeedbackSection;
