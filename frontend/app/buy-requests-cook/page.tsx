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
import { useCreateBuyRequestMutation } from '../tools/redux/api/buyRequests';
import { Notification } from '../components/Notification/Notification';

const BuyRequestsPageCook: React.FC = () => {
	const currentUser = useSelector(selectUser);
	const [requests, setRequests] = useState<IBuyRequest[]>([]);
	const [isOpenAddForm, setIsOpenAuthForm] = useState(false);
	const [notification, setNotification] = useState({ isOpen: false, ok: false, text: "" });

	const {
		data: ingredients,
		isLoading: ingredientsLoading,
		refetch: refetchIngredients,
	} = useGetAllIngredientsQuery();
	const [createBuyRequest] = useCreateBuyRequestMutation();

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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setNotification({ isOpen: true, ok: false, text: "Амёбv.dknvldfbvdlkfа" });

		setIsOpenAuthForm(false);
	}

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
				<form onSubmit={handleSubmit}>
					<h1>Создание заявки на покупку</h1>
					<div className={Styles["ingr_div"]}>
						<h2>Ингредиент: </h2>
						<select className={Styles["select"]} id="ingredient" name="ingredient">
							{ingredients && ingredients.data?.map((ingredient, index) => {
								return <option key={index} value={ingredient.id}>{ingredient.name}</option>
							})}
						</select>
					</div>
					<div className={Styles["ingr_div"]}>
						<h2>Количество: </h2>
						<input className={Styles['input']} type='text' id='quality' />
					</div>
					<div className={Styles.button_div}>
						<button className="button" type="submit">Отправить</button>
					</div>
				</form>
			</Popup>
		)}

		{notification.isOpen && (
			<Notification 
				close={() => { setNotification({ ...notification, isOpen: false}) }}
				ok={notification.ok}
				text={notification.text}
			/>
		)}
		</>
	);
};

export default BuyRequestsPageCook;
