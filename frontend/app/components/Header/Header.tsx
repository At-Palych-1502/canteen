'use client';

import Link from 'next/link';
import Styles from './Header.module.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, SetOrderCount, setUser } from '@/app/tools/redux/user';
import { RootState } from '@/app/tools/redux/store';
import { IUser } from '@/app/tools/types/user.d';
import {
	removeAccessToken,
	removeUserLocalStorage,
} from '@/app/tools/utils/auth';
import { AuthButtons } from './AuthButtons';
import { UserMenu } from './UserMenu';
import { AuthPopups } from './AuthPopups';
import { useRouter } from 'next/navigation';

export const Header = () => {
	const router = useRouter();
	const User: IUser | null = useSelector(selectUser);
	const dispatch = useDispatch();
	const [isLoginPopup, setIsLoginPopup] = useState(false);
	const [isRegisterPopup, setIsRegisterPopup] = useState(false);
	const orderCount = useSelector((state: RootState) => state.user.orderCount);

	const logout = () => {
		dispatch(setUser(null));
		removeAccessToken();
		removeUserLocalStorage();
		router.push('/');
	};

	return (
		<>
			<header className={Styles['header']}>
				<div className={Styles['header_container']}>
					<Link href='/'>
						<h1 className={Styles['main_title'] + ' color-primary'}>
							Умная столовая
						</h1>
					</Link>
					{!User ? (
						<AuthButtons
							onLoginClick={() => setIsLoginPopup(true)}
							onRegisterClick={() => setIsRegisterPopup(true)}
						/>
					) : (
						<UserMenu user={User} onLogout={logout} orderCount={orderCount} />
					)}
				</div>
			</header>

			<AuthPopups
				isLoginPopup={isLoginPopup}
				isRegisterPopup={isRegisterPopup}
				onCloseLoginPopup={() => setIsLoginPopup(false)}
				onCloseRegisterPopup={() => setIsRegisterPopup(false)}
				onOpenLoginPopup={() => setIsLoginPopup(true)}
			/>
		</>
	);
};
