import React from 'react';
import RequestCard from '../RequestCard/RequestCard';
import Styles from './RequestsList.module.css';
import { IBuyRequest } from '@/app/tools/types/buyRequests';

interface RequestsListProps {
	requests: IBuyRequest[];
	onApprove: (requestId: number) => void;
	onReject: (requestId: number) => void;
	onQuantityChange: (requestId: number, newQuantity: number) => void;
}

const RequestsList: React.FC<RequestsListProps> = ({
	requests,
	onApprove,
	onReject,
	onQuantityChange,
}) => {
	const pendingRequests = requests.filter(r => r.is_accepted === null);
	const processedRequests = requests.filter(r => r.is_accepted !== null);

	const handleApprove = (requestId: number) => {
		onApprove(requestId);
	};

	const handleReject = (requestId: number) => {
		onReject(requestId);
	};

	const handleQuantityChange = (requestId: number, newQuantity: number) => {
		onQuantityChange(requestId, newQuantity);
	};

	return (
		<div className={Styles.container}>
			{pendingRequests.length > 0 && (
				<div className={Styles.section}>
					<h2 className={Styles.sectionTitle}>
						Ожидающие рассмотрения ({pendingRequests.length})
					</h2>
					<div className={Styles.requestsGrid}>
						{pendingRequests.map(request => (
							<RequestCard
								key={request.id}
								request={request}
								onApprove={handleApprove}
								onReject={handleReject}
								onQuantityChange={handleQuantityChange}
							/>
						))}
					</div>
				</div>
			)}

			{processedRequests.length > 0 && (
				<div className={Styles.section}>
					<h2 className={Styles.sectionTitle}>
						Обработанные ({processedRequests.length})
					</h2>
					<div className={Styles.requestsGrid}>
						{processedRequests.map(request => (
							<RequestCard
								key={request.id}
								request={request}
								onApprove={handleApprove}
								onReject={handleReject}
								onQuantityChange={handleQuantityChange}
							/>
						))}
					</div>
				</div>
			)}

			{requests.length === 0 && (
				<div className={Styles.emptyState}>
					<div className={Styles.emptyIcon}>📋</div>
					<p className={Styles.emptyText}>Нет заявок на покупки</p>
				</div>
			)}
		</div>
	);
};

export default RequestsList;
