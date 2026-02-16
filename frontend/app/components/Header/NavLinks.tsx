"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Styles from './Header.module.css';
import { Popup } from '../Popup/Popup';
import { Balance } from '../balance/Balance';

interface IProps {
	role: 'admin' | 'cook' | 'student';
	orderCount?: number;
}

const NavLinks = ({ role, orderCount = 0 }: IProps) => {
	const [isBalance, setIsBalance] = useState(false);

	if (role === 'admin') {
		return (
			<>
				<li>
					<Link href={'/edit-data'} className={Styles['button']}>
						Изменение данных
					</Link>
				</li>
				<li>
					<Link href={'/buy-requests'} className={Styles['button']}>
						Заявки на покупки
					</Link>
				</li>
				<li>
					<Link href={'/create-report'} className={Styles['button']}>
						Создать отчет
					</Link>
				</li>
			</>
		);
	} else if (role === 'cook') {
		return (
			<>
				<li>
					<Link href={'/buy-requests-cook'} className={Styles['button']}>
						Заявка на покупку
					</Link>
				</li>
				<li>
					<Link href={'/meals'} className={Styles['button']}>
						Список блюд и продуктов
					</Link>
				</li>
			</>
		);
	} else {
		return (
			<>
				<li>
					<Link href={'/buy'} className={Styles['button']}>
						Покупка питания
						{orderCount > 0 && (
							<span className={Styles['order-badge']}>{orderCount}</span>
						)}
					</Link>
				</li>
				<li>
					<Link href={'/allergies'} className={Styles['button']}>
						Пищевые особенности
					</Link>
				</li>
				<li>
					<Link href={'/feedback'} className={Styles['button']}>
						Отзывы
					</Link>
				</li>
				<li>
					<Link onClick={() => setIsBalance(true)} href={'#'} className={Styles['button']}>
						Баланс
					</Link>
				</li>

				{isBalance && (
					<Popup closePopup={() => setIsBalance(false)}>
						<h1>Пополнение баланса</h1>
						<Balance />
					</Popup>
				)}
			</>
		);
	}
};

export default NavLinks;
