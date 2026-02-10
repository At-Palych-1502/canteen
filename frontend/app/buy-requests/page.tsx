'use client';
import React from 'react';
import RequestsList from '../components/admin/BuyRequests/RequestsList/RequestsList';
import Styles from './page.module.css';
import {
	useAcceptBuyRequestMutation,
	useGetAllBuyRequestsQuery,
	useRejectBuyRequestMutation,
	useUpdateBuyRequestMutation,
} from '../tools/redux/api/buyRequests';

const BuyRequestsPage = () => {
	const { data, isLoading, refetch } = useGetAllBuyRequestsQuery();
	const [acceptBuyRequest] = useAcceptBuyRequestMutation();
	const [rejectBuyRequest] = useRejectBuyRequestMutation();
	const [updateBuyRequest] = useUpdateBuyRequestMutation();

	console.log(data, isLoading);

	const handleApprove = (requestId: number) => {
		acceptBuyRequest(requestId);
		refetch();
	};

	const handleReject = (requestId: number) => {
		rejectBuyRequest(requestId);
		refetch();
	};

	const handleQuantityChange = (requestId: number, newQuantity: number) => {
		updateBuyRequest({ id: requestId, data: { quantity: newQuantity } });
		refetch();
	};

	return (
		<div className={Styles.container}>
			<h1 className={Styles.title}>Заявки на покупки</h1>
			{data ? (
				<RequestsList
					requests={data.purchase_requests}
					onApprove={handleApprove}
					onReject={handleReject}
					onQuantityChange={handleQuantityChange}
				/>
			) : (
				<p>Загрузка...</p>
			)}
		</div>
	);
};

export default BuyRequestsPage;
