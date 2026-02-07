'use client';

import Link from 'next/link';
import Styles from './Header.module.css';
import { Popup } from '../Popup/Popup';
import { useState } from 'react';
import { AuthForm } from '../AuthForm/AuthForm';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '@/app/tools/redux/user';
import { IUser } from '@/app/tools/types/user.d';
import { removeAccessToken } from '@/app/tools/utils/auth';

export function Header() {
	const dispatch = useDispatch();
	const User: IUser | null = useSelector(selectUser);
	const [isLoginPopup, setIsLoginPopup] = useState(false);
	const [isRegisterPopup, setIsRegisterPopup] = useState(false);

	const logout = () => {
		dispatch(setUser(null));
		removeAccessToken();
	};

	return (
		<>
			<header className={Styles['header']}>
				<div className={Styles['header_container']}>
					<Link href='/'>
						<h1 className={Styles['main_title']}>Умная столовая</h1>
					</Link>
					<ul className={Styles['button_list']}>
						{User && User.role === 'admin' && (
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
						)}
					</ul>
					{!User ? (
						<>
							<button
								onClick={() => setIsRegisterPopup(true)}
								className={Styles['auth_button']}
							>
								Зарегистрироваться
							</button>
							<button
								onClick={() => setIsLoginPopup(true)}
								className={Styles['auth_button']}
							>
								Войти
							</button>
						</>
					) : (
						<div>
							<span>{User.username} </span>
							<span>
								<button onClick={logout} className={Styles['auth_button']}>
									Выйти
								</button>
							</span>
						</div>
					)}
				</div>
			</header>

			{isLoginPopup && (
				<Popup closePopup={() => setIsLoginPopup(false)}>
					<AuthForm
						isLogin={true}
						closePopup={() => setIsLoginPopup(false)}
						openLoginPopup={() => setIsLoginPopup(true)}
					/>
				</Popup>
			)}
			{isRegisterPopup && (
				<Popup closePopup={() => setIsRegisterPopup(false)}>
					<AuthForm
						isLogin={false}
						closePopup={() => setIsRegisterPopup(false)}
						openLoginPopup={() => setIsLoginPopup(true)}
					/>
				</Popup>
			)}
		</>
	);
}
