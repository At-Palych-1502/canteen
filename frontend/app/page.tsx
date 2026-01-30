'use client';

import Image from 'next/image';
import {
	FocusEvent,
	FormEvent,
	FormEventHandler,
	useEffect,
	useState,
} from 'react';
import { endpoints } from './config/endpoints';
import { loginUser } from './tools/auth';
import { AuthForm } from './components/AuthForm/AuthForm';
import { Header } from './components/Header/Header';
import Styles from './page.module.css';
import { useGetUserQuery, useLoginMutation } from './tools/redux/api/auth';
import { getAccessToken } from './tools/utils/auth';
import {
	useAddIngredientMutation,
	useCreateDishMutation,
	useDeleteDishMutation,
	useGetAllDishesQuery,
	useGetDishByIdQuery,
	useUpdateDishMutation,
} from './tools/redux/api/dishes';
import {
	useCreateIngredientMutation,
	useDeleteIngredientMutation,
	useGetAllIngredientsQuery,
	useUpdateIngredientMutation,
} from './tools/redux/api/ingredients';

export default function Home() {
	const [login] = useLoginMutation();

	// const { data, error, isLoading } = useGetUserQuery();

	// console.log(data, error, isLoading);

	// const { data, error, isLoading } = useGetDishByIdQuery(123);
	// const { data, error, isLoading } = useGetAllDishesQuery();

	// const [removeDish] = useDeleteDishMutation();
	// const [updateDish] = useUpdateDishMutation();
	// const [createDish] = useCreateDishMutation();
	// const [addIngredient] = useAddIngredientMutation();

	// useEffect(() => {
	// 	const a = async () => {
	// 		// const res = await login({ username: 'admin', password: 'password' });
	// 		// const res = await updateDish({ id: 1, data: { name: 'омлет' } });
	// 		// const res = await createDish({
	// 		// 	name: 'омлет2',
	// 		// 	quantity: 100,
	// 		// 	weight: 50,
	// 		// }); // не работает
	// 		// const res = await removeDish(1); // не работает
	// 		const res = await addIngredient(1, 6); // не работает

	// 		console.log(res);
	// 	};
	// 	a();
	// }, []);

	// const { data, error, isLoading } = useGetAllIngredientsQuery();

	// console.log(data, error, isLoading);

	// const [removeIngredient] = useDeleteIngredientMutation();
	// const [updateIngredient] = useUpdateIngredientMutation();
	// const [createIngredient] = useCreateIngredientMutation();

	// const { data, error, isLoading } = useGetUserQuery();

	// console.log(data, error, isLoading);

	// useEffect(() => {
	// 	const a = async () => {
	// 		const res = await login({ username: 'admin', password: 'password' });
	// 		// const res = await updateIngredient({ id: 6, data: { name: 'морковь3' } });
	// 		// const res = await createIngredient({
	// 		// 	name: 'морковь2',
	// 		// });
	// 		// const res = await removeIngredient(7);

	// 		console.log(res);
	// 	};
	// 	a();
	// }, []);

	return (
		<>
			<section className={Styles['section']}>
				<div className={Styles['title_section']}>
					<h1 className={Styles['title_section__title']}>Школьная столовая</h1>
					<h4 className={Styles['title_section__description']}>
						Удобный контроль питания для учеников, поваров и администрации
					</h4>
				</div>
			</section>

			<section className={Styles['section']}>
				<div className={Styles['ability_section']}>
					<h2 className={Styles['ability_section__title']}>
						Возможности сервиса
					</h2>
					<ul className={Styles['ability_ul']}>
						<li className={Styles['ability_li']}>
							<img
								src='/student.png'
								alt='Ученик'
								className={Styles['ability_img']}
							/>
							<h4>Для учеников</h4>
							<p>
								Просмотр меню, оплата питания, отметка о получении и
								индивидуальный план с учётом аллергии
							</p>
						</li>
						<li className={Styles['ability_li']}>
							<img
								src='/cook.png'
								alt='Повар'
								className={Styles['ability_img']}
							/>
							<h4>Для поваров</h4>
							<p>
								Учет выданных блюд, контроль остатков и заявки на закупку
								продуктов
							</p>
						</li>
						<li className={Styles['ability_li']}>
							<img
								src='/admin.png'
								alt='Техник'
								className={Styles['ability_img']}
							/>
							<h4>Для администрации</h4>
							<p>
								Статистика оплат, согласование закупок и формирование отчетов
							</p>
						</li>
					</ul>
				</div>
			</section>
		</>
	);
}
