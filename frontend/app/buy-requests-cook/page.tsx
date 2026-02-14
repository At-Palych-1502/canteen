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
import { IIngredient } from '../tools/types/ingredients';
import { isNumberObject } from 'util/types';
import { putIngridientsRequest } from '../tools/utils/ingriduents';

const BuyRequestsPageCook: React.FC = () => {
	const currentUser = useSelector(selectUser);
	const [requests, setRequests] = useState<IBuyRequest[]>([]);
	const [isOpenAddForm, setIsOpenAuthForm] = useState(false);
	const [curIngridient, setCurIngridient] = useState<number>();
	const [curQuality, setCurQuality] = useState<number>();
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

	useEffect(() => {
		if (isOpenAddForm) {
			setCurIngridient(ingredients?.data[0]?.id ?? 0);
		}
	}, [isOpenAddForm]);

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

	const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurIngridient(Number(e.currentTarget.value));
	}

	const qualityChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value)) {
			setCurQuality(Number(e.target.value));
		} else {
			setNotification({ isOpen: true, ok: false, text: "Некоректный ввод количества товара" });
		}
	}

	const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (curQuality) {
			const data = { ingredient_id: curIngridient ?? 1, quantity: curQuality };
			
			const response = await putIngridientsRequest(data);
			setNotification({ isOpen: true, ...response });

			setIsOpenAuthForm(false);
		} else {
			setNotification({ isOpen: true, ok: false, text: "Введите количество товара!" });
		}
		
		

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
						<select onChange={selectHandler} className={Styles["select"]} id="ingredient" name="ingredient">
							{ingredients && ingredients.data?.map((ingredient, index) => {
								return <option key={index} value={ingredient.id}>{ingredient.name}</option>
							})}
						</select>
					</div>
					<div className={Styles["ingr_div"]}>
						<h2>Количество: </h2>
						<input onChange={qualityChangeHandler} className={Styles['input']} type='number' id='quality' />
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
