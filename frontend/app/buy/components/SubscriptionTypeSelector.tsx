import React from 'react';
import Styles from '../page.module.css';

type SubscriptionType =
	| 'breakfast'
	| 'lunch'
	| 'dinner'
	| 'breakfast-lunch'
	| 'breakfast-lunch-dinner'
	| 'breakfast-dinner'
	| 'lunch-dinner'
	| 'full';

interface Props {
	subscriptionType: SubscriptionType;
	onSubscriptionTypeChange: (type: SubscriptionType) => void;
}

export const SubscriptionTypeSelector: React.FC<Props> = ({
	subscriptionType,
	onSubscriptionTypeChange,
}) => {
	return (
		<div className={Styles['subscription-type-section']}>
			<div className={Styles['dishes-header']}>
				<h2>Выберите тип абонемента</h2>
				<p className={Styles['hint']}>Какие приемы пищи включены в абонемент</p>
			</div>
			<div className={Styles['subscription-types']}>
				<button
					className={`${Styles['subscription-type-button']} ${
						subscriptionType === 'breakfast' ? Styles.selected : ''
					}`}
					onClick={() => onSubscriptionTypeChange('breakfast')}
				>
					Только завтрак
				</button>
				<button
					className={`${Styles['subscription-type-button']} ${
						subscriptionType === 'breakfast-lunch' ? Styles.selected : ''
					}`}
					onClick={() => onSubscriptionTypeChange('breakfast-lunch')}
				>
					Завтрак и обед
				</button>
				<button
					className={`${Styles['subscription-type-button']} ${
						subscriptionType === 'breakfast-lunch-dinner' ? Styles.selected : ''
					}`}
					onClick={() => onSubscriptionTypeChange('breakfast-lunch-dinner')}
				>
					Завтрак, обед и полдник
				</button>
			</div>
		</div>
	);
};
