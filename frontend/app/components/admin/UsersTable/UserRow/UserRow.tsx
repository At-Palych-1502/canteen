import React from 'react';
import { IUser, UserRole } from '../../../../tools/types/user';
import Styles from './UserRow.module.css';

interface Props {
	user: IUser;
	onChangeRole: (userId: number) => void;
	onDelete: (userId: number) => void;
}

const roleLabels: Record<UserRole, string> = {
	student: 'Ученик',
	cook: 'Повар',
	admin: 'Администратор',
};

export const UserRow: React.FC<Props> = ({ user, onChangeRole, onDelete }) => {
	return (
		<tr className={Styles.row}>
			<td className={Styles.cell}>{user.username}</td>
			<td className={Styles.cell}>
				<span className={`${Styles.badge} ${Styles[user.role]}`}>
					{roleLabels[user.role]}
				</span>
			</td>
			<td className={Styles.cell}>{user.email}</td>
			<td className={`${Styles.cell} ${Styles.actions}`}>
				<button
					className={`${Styles.button} ${Styles.changeRoleButton}`}
					onClick={() => onChangeRole(user.id)}
				>
					Изменить роль
				</button>
				<button
					className={`${Styles.button} ${Styles.deleteButton}`}
					onClick={() => onDelete(user.id)}
				>
					Удалить
				</button>
			</td>
		</tr>
	);
};
