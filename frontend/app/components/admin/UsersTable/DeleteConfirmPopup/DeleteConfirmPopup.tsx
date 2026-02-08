import React from 'react';
import { Popup } from '../../../Popup/Popup';
import Styles from './DeleteConfirmPopup.module.css';

interface Props {
	userId: number;
	username: string;
	onClose: VoidFunction;
	onConfirm: (userId: number) => void;
}

export const DeleteConfirmPopup: React.FC<Props> = ({
	userId,
	username,
	onClose,
	onConfirm,
}) => {
	const handleConfirm = () => {
		onConfirm(userId);
		onClose();
	};

	return (
		<Popup closePopup={onClose}>
			<div className={Styles.container}>
				<h2 className={Styles.title}>Подтверждение удаления</h2>
				<p className={Styles.message}>
					Вы действительно хотите удалить пользователя{' '}
					<strong>{username}</strong>?
				</p>
				<p className={Styles.warning}>Это действие невозможно отменить.</p>
				<div className={Styles.buttons}>
					<button
						className={`${Styles.button} ${Styles.cancelButton}`}
						onClick={onClose}
					>
						Отмена
					</button>
					<button
						className={`${Styles.button} ${Styles.confirmButton}`}
						onClick={handleConfirm}
					>
						Удалить
					</button>
				</div>
			</div>
		</Popup>
	);
};
