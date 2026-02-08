import React from 'react';
import Styles from '../page.module.css';

interface Props {
	totalPrice: number;
	summaryText: string;
	onOrder: () => void;
	disabled?: boolean;
}

export const OrderSection: React.FC<Props> = ({
	totalPrice,
	summaryText,
	onOrder,
	disabled = false,
}) => {
	return (
		<div className={Styles['order-section']}>
			<div className={Styles['order-header']}>
				<h2>Ваш заказ</h2>
			</div>
			<div className={Styles['order-summary']}>
				<span className={Styles['summary-text']}>{summaryText}</span>
				<span className={Styles['total-price']}>{totalPrice} ₽</span>
			</div>
			<button
				className={Styles['order-button']}
				onClick={onOrder}
				disabled={disabled}
			>
				Оформить заказ
			</button>
		</div>
	);
};
