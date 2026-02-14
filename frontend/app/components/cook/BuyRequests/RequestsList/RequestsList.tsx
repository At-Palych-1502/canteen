import React from 'react';
import Styles from './RequestsList.module.css';
import RequestCard from '../RequestCard/RequestCard';
import { IBuyRequest } from '@/app/tools/types/buyRequests';

interface RequestsListProps {
	requests: IBuyRequest[];
}

const RequestsList: React.FC<RequestsListProps> = ({
	requests
}) => {
	const pendingRequests = requests.filter(r => r.is_accepted === null);
	const processedRequests = requests.filter(r => r.is_accepted !== null);

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
