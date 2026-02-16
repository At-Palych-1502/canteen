import React from 'react';
import Styles from '../page.module.css';

interface Props {
	totalPrice: number;
	summaryText: string;
	onOrder: () => void;
	disabled?: boolean;
	balance: number
}

export const OrderSection: React.FC<Props> = ({
	totalPrice,
	summaryText,
	onOrder,
	disabled,
	balance
}) => {
	return (
		<div className={Styles['order-section']}>
			<div className={Styles['order-header']}>
				<h2>{`Ваш баланс: ${balance} руб.`}</h2>
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
