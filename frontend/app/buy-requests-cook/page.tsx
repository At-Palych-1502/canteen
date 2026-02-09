'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../tools/redux/user';
import { IBuyRequest } from '../tools/types/mock';
import {
	getBuyRequests,
	approveBuyRequest,
	rejectBuyRequest,
	updateBuyRequestQuantity,
} from '../tools/mockData';
import RequestsList from '../components/cook/BuyRequests/RequestsList/RequestsList';
import Styles from './page.module.css';

const BuyRequestsPageCook: React.FC = () => {
	const currentUser = useSelector(selectUser);
	const [requests, setRequests] = useState<IBuyRequest[]>([]);

	useEffect(() => {
		loadRequests();
	}, []);

	const loadRequests = () => {
		const loadedRequests = getBuyRequests();
		setRequests(loadedRequests);
	};

	const handleApprove = (requestId: number) => {
		const success = approveBuyRequest(requestId);
		if (success) {
			loadRequests();
		}
	};

	const handleReject = (requestId: number) => {
		const success = rejectBuyRequest(requestId);
		if (success) {
			loadRequests();
		}
	};

	const handleQuantityChange = (requestId: number, newQuantity: number) => {
		const success = updateBuyRequestQuantity(requestId, newQuantity);
		if (success) {
			loadRequests();
		}
	};

	return (
		<div className={Styles.container}>
			<h1 className={Styles.title}>Заявки на покупки</h1>
			<RequestsList
				requests={requests}
				onApprove={handleApprove}
				onReject={handleReject}
				onQuantityChange={handleQuantityChange}
			/>
		</div>
	);
};

export default BuyRequestsPageCook;
