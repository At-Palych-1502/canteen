'use client';

import React from 'react';
import Styles from './Header.module.css';
import NavLinks from './NavLinks';
import { IUser } from '@/app/tools/types/user';

interface Props {
	user: IUser;
	onLogout: () => void;
	orderCount: number;
}

export const UserMenu: React.FC<Props> = ({ user, onLogout, orderCount }) => {
	return (
		<>
			<ul className={Styles['button_list'] + ' color-primary'}>
				<NavLinks role={user.role} orderCount={orderCount} />
			</ul>
			<div>
				<span>{user.username} </span>
				<span>
					<button onClick={onLogout} className={Styles['auth_button']}>
						Выйти
					</button>
				</span>
			</div>
		</>
	);
};
