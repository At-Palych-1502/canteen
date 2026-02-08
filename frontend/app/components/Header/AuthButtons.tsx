'use client';

import React from 'react';
import Styles from './Header.module.css';

interface Props {
	onLoginClick: () => void;
	onRegisterClick: () => void;
}

export const AuthButtons: React.FC<Props> = ({
	onLoginClick,
	onRegisterClick,
}) => {
	return (
		<div className={Styles['auth-buttons']}>
			<button onClick={onRegisterClick} className={Styles['auth_button']}>
				Зарегистрироваться
			</button>
			<button onClick={onLoginClick} className={Styles['auth_button']}>
				Войти
			</button>
		</div>
	);
};
