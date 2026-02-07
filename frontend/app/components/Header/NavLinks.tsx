import React from 'react';
import Link from 'next/link';
import Styles from './Header.module.css';

interface IProps {
	role: 'admin' | 'cook' | 'student';
}

const NavLinks = ({ role }: IProps) => {
	if (role === 'admin') {
		return (
			<>
				<li>
					<Link href={'/stats'} className={Styles['button']}>
						Статистика
					</Link>
				</li>
				<li>
					<Link href={'/buys'} className={Styles['button']}>
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
					<Link href={'/buy-request'} className={Styles['button']}>
						Заявка на покупку
					</Link>
				</li>
				<li>
					<Link href={'/meals'} className={Styles['button']}>
						Список блю и продуктов
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
			</>
		);
	}
};

export default NavLinks;
