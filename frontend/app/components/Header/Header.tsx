'use client';

import Link from 'next/link';
import Styles from './Header.module.css';
import { Popup } from '../Popup/Popup';
import { useState } from 'react';
import { AuthForm } from '../AuthForm/AuthForm';

export function Header() {
	const [isPopup, setIsPopup] = useState(false);

	return (
		<>
			<header className={Styles['header']}>
				<div className={Styles['header_container']}>
					<Link href='/'>
						<h1 className={Styles['main_title']}>Умная столовая</h1>
					</Link>
					<ul className={Styles['button_list']}>
						<li>
							<button className={Styles['button']}>Меню</button>
						</li>
						<li>
							<button className={Styles['button']}>Абонементы</button>
						</li>
						<li>
							<button className={Styles['button']}>Отзывы</button>
						</li>
						<li>
							<button className={Styles['button']}>Контакты</button>
						</li>
					</ul>
					<button
						onClick={() => setIsPopup(true)}
						className={Styles['auth_button']}
					>
						Войти
					</button>
				</div>
			</header>

			{isPopup && (
				<Popup closePopup={() => setIsPopup(false)}>
					<AuthForm closePopup={() => setIsPopup(false)} />
				</Popup>
			)}
		</>
	);
}
