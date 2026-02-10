import React from 'react';
import StatusBadge from '../StatusBadge/StatusBadge';
import QuantityControl from '../QuantityControl/QuantityControl';
import Styles from './RequestCard.module.css';
import { IBuyRequest } from '@/app/tools/types/buyRequests';

interface RequestCardProps {
	request: IBuyRequest;
	onApprove: (requestId: number) => void;
	onReject: (requestId: number) => void;
	onQuantityChange: (requestId: number, newQuantity: number) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
	request,
	onApprove,
	onReject,
	onQuantityChange,
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

	const isPending = request.is_accepted === null;

	return (
		<div className={`${Styles.card} ${!isPending ? Styles.disabled : ''}`}>
			<div className={Styles.header}>
				<div className={Styles.authorInfo}>
					<div className={Styles.username}>
						Имя пользователя: {request.user.username}
					</div>
					<div className={Styles.username}>Почта: {request.user.email}</div>
				</div>
				<StatusBadge status={request.is_accepted ?? 'pending'} />
			</div>
			<div className={Styles.body}>
				<div className={Styles.ingredientSection}>
					<div className={Styles.ingredientName}>{request.ingredient.name}</div>
					<div className={Styles.quantityInfo}>
						<div className={Styles.quantityRow}>
							<span className={Styles.label}>Запрошено:</span>
							<QuantityControl
								remaining={request.ingredient.quantity}
								value={request.quantity}
								onChange={newQuantity =>
									onQuantityChange(request.id, newQuantity)
								}
								disabled={!isPending}
							/>
						</div>
					</div>
				</div>

				<div className={Styles.dateInfo}>
					<span className={Styles.dateLabel}>Создано:</span>
					<span className={Styles.dateValue}>{formatDate(request.date)}</span>
				</div>
			</div>

			{isPending && (
				<div className={Styles.actions}>
					<button
						className={`${Styles.actionButton} ${Styles.approveButton}`}
						onClick={() => onApprove(request.id)}
					>
						Одобрить
					</button>
					<button
						className={`${Styles.actionButton} ${Styles.rejectButton}`}
						onClick={() => onReject(request.id)}
					>
						Отклонить
					</button>
				</div>
			)}
		</div>
	);
};

export default RequestCard;
