import React from 'react';
import Styles from './StatusBadge.module.css';

interface Props {
	status: 'pending' | boolean;
}

const statusLabels = {
	pending: 'Ожидает',
	approved: 'Одобрено',
	denied: 'Отклонено',
};

const StatusBadge = ({ status }: Props) => {
	const s =
		typeof status !== 'boolean' ? status : status ? 'approved' : 'denied';

	return (
		<span className={`${Styles.badge} ${Styles[s]}`}>{statusLabels[s]}</span>
	);
};

export default StatusBadge;
