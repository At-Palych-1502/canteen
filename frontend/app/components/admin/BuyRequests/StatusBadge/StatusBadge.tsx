import React from 'react';
import { BuyRequestStatus } from '@/app/tools/types/mock';
import Styles from './StatusBadge.module.css';

interface StatusBadgeProps {
	status: BuyRequestStatus;
}

const statusLabels: Record<BuyRequestStatus, string> = {
	pending: 'Ожидает',
	approved: 'Одобрено',
	rejected: 'Отклонено',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	return (
		<span className={`${Styles.badge} ${Styles[status]}`}>
			{statusLabels[status]}
		</span>
	);
};

export default StatusBadge;
