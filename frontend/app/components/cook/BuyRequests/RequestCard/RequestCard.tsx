import React from 'react';
import StatusBadge from '../StatusBadge/StatusBadge';
import QuantityControl from '../QuantityControl/QuantityControl';
import Styles from './RequestCard.module.css';
import { IBuyRequest } from '@/app/tools/types/buyRequests';

interface RequestCardProps {
	request: IBuyRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({
	request,
}) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const isPending = request.is_accepted === 'pending';

	return (
		<div className={`${Styles.card} ${!isPending ? Styles.disabled : ''}`}>
			<div className={Styles.header}>
				<div className={Styles.authorInfo}>
					<div className={Styles.username}>{`Имя: ${request?.user?.name ?? "Аноним"}`}</div>
					<div className={Styles.fullName}>{`Имя пользователя: ${request?.user?.username ?? "Аноним"}`}</div>
				</div>
				<StatusBadge status={request.is_accepted ?? false} />
			</div>

			<div className={Styles.body}>
				<div className={Styles.ingredientSection}>
					<div className={Styles.ingredientName}>{request.ingredient.name}</div>
					<div className={Styles.quantityInfo}>
						<div className={Styles.quantityRow}>
							<span className={Styles.label}>Запрошено:</span>
							<h5>{request.quantity}</h5>
						</div>
					</div>
				</div>

				<div className={Styles.dateInfo}>
					<span className={Styles.dateLabel}>Создано:</span>
					<span className={Styles.dateValue}>
						{formatDate(request.date)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default RequestCard;
