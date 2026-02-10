import React from 'react';
import Styles from './StatusBadge.module.css';
import { BuyRequestStatus } from '@/app/tools/types/buyRequests';

interface Props {
	status: BuyRequestStatus;
}

const statusLabels = {
	pending: 'Ожидает',
	approved: 'Одобрено',
	denied: 'Отклонено',
};

const StatusBadge = ({ status }: Props) => {
	const s = status === null ? 'pending' : status ? 'approved' : 'denied';

	return (
		<span className={`${Styles.badge} ${Styles[s]}`}>{statusLabels[s]}</span>
	);
};

export default StatusBadge;
