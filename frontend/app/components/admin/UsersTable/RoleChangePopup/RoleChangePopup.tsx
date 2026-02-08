import React, { useState } from 'react';
import { UserRole } from '../../../../tools/types/user';
import { Popup } from '../../../Popup/Popup';
import Styles from './RoleChangePopup.module.css';

interface Props {
	userId: number;
	username: string;
	currentRole: UserRole;
	onClose: VoidFunction;
	onSave: (userId: number, newRole: UserRole) => void;
}

const roleOptions: { value: UserRole; label: string }[] = [
	{ value: 'student', label: 'Ученик' },
	{ value: 'cook', label: 'Повар' },
	{ value: 'admin', label: 'Администратор' },
];

export const RoleChangePopup: React.FC<Props> = ({
	userId,
	username,
	currentRole,
	onClose,
	onSave,
}) => {
	const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

	const handleSave = () => {
		onSave(userId, selectedRole);
		onClose();
	};

	return (
		<Popup closePopup={onClose}>
			<div className={Styles.container}>
				<h2 className={Styles.title}>Изменение роли пользователя</h2>
				<p className={Styles.userInfo}>
					Пользователь: <strong>{username}</strong>
				</p>
				<div className={Styles.form}>
					<label className={Styles.label} htmlFor='role-select'>
						Новая роль:
					</label>
					<select
						id='role-select'
						className={Styles.select}
						value={selectedRole}
						onChange={e => setSelectedRole(e.target.value as UserRole)}
					>
						{roleOptions.map(option => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
				<div className={Styles.buttons}>
					<button
						className={`${Styles.button} ${Styles.cancelButton}`}
						onClick={onClose}
					>
						Отмена
					</button>
					<button
						className={`${Styles.button} ${Styles.saveButton}`}
						onClick={handleSave}
					>
						Сохранить
					</button>
				</div>
			</div>
		</Popup>
	);
};
