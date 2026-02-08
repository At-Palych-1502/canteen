'use client';

import React from 'react';
import { Popup } from '../Popup/Popup';
import { AuthForm } from '../AuthForm/AuthForm';

interface Props {
	isLoginPopup: boolean;
	isRegisterPopup: boolean;
	onCloseLoginPopup: () => void;
	onCloseRegisterPopup: () => void;
	onOpenLoginPopup: () => void;
}

export const AuthPopups: React.FC<Props> = ({
	isLoginPopup,
	isRegisterPopup,
	onCloseLoginPopup,
	onCloseRegisterPopup,
	onOpenLoginPopup,
}) => {
	return (
		<>
			{isLoginPopup && (
				<Popup closePopup={onCloseLoginPopup}>
					<AuthForm
						isLogin={true}
						closePopup={onCloseLoginPopup}
						openLoginPopup={onOpenLoginPopup}
					/>
				</Popup>
			)}
			{isRegisterPopup && (
				<Popup closePopup={onCloseRegisterPopup}>
					<AuthForm
						isLogin={false}
						closePopup={onCloseRegisterPopup}
						openLoginPopup={onOpenLoginPopup}
					/>
				</Popup>
			)}
		</>
	);
};
