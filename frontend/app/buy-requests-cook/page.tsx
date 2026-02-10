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
import { Popup } from '../components/Popup/Popup';
import { useGetAllIngredientsQuery } from '../tools/redux/api/ingredients';

const BuyRequestsPageCook: React.FC = () => {
	const currentUser = useSelector(selectUser);
	const [requests, setRequests] = useState<IBuyRequest[]>([]);
	const [isOpenAddForm, setIsOpenAuthForm] = useState(false);

	const {
		data: ingredients,
		isLoading: ingredientsLoading,
		refetch: refetchIngredients,
	} = useGetAllIngredientsQuery();

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
		<>
		<div className={Styles.container}>
			<div className={Styles["header"]}>
				<h1 className={Styles.title}>Заявки на покупки</h1>
				<button onClick={() => {setIsOpenAuthForm(true)}} className={Styles["button"]}>Добавить</button>
			</div>
			<RequestsList
				requests={requests}
				onApprove={handleApprove}
				onReject={handleReject}
				onQuantityChange={handleQuantityChange}
			/>
		</div>

		{isOpenAddForm && !ingredientsLoading && (
			<Popup closePopup={() => {setIsOpenAuthForm(false)}}>
				<form>
					<h1>Создание заявки на покупку</h1>
					<div className={Styles["ingr_div"]}>
						<h3>Ингредиент: </h3>
						<select id="city" name="city">
							{ingredients && ingredients.data?.map((ingredient, index) => {
								return <option key={index} value={ingredient.id}>{ingredient.name}</option>
							})}
						</select>
					</div>
					<div className={Styles["ingr_div"]}>
						<h3>Количество: </h3>
						<input type='text'></input>
					</div>
				</form>
			</Popup>
		)}
		</>
	);
};

export default BuyRequestsPageCook;
