'use client';

import React from 'react';
import Styles from './Header.module.css';
import NavLinks from './NavLinks';

interface Props {
	username: string;
	onLogout: () => void;
	orderCount: number;
}

export const UserMenu: React.FC<Props> = ({
	username,
	onLogout,
	orderCount,
}) => {
	return (
		<>
			<ul className={Styles['button_list'] + ' color-primary'}>
				<NavLinks role={'student'} orderCount={orderCount} />
			</ul>
			<div>
				<span>{username} </span>
				<span>
					<button onClick={onLogout} className={Styles['auth_button']}>
						Выйти
					</button>
				</span>
			</div>
		</>
	);
};
