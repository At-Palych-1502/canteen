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
import { useGetDishesQuery } from './tools/redux/dishes';
import { useGetUserQuery, useLoginMutation } from './tools/redux/auth';
import { getAccessToken } from './utils/auth';

export default function Home() {
	// const { data, error, isLoading } = useGetDishesQuery();

	// console.log(data, error, isLoading);

	// const [login] = useLoginMutation();
	// const { data, error, isLoading } = useGetUserQuery();

	// console.log(data, error, isLoading);
	// console.log(getAccessToken());

	// useEffect(() => {
	// 	const a = async () => {
	// 		const res = await login({ username: 'user1', password: 'passwd' });

	// 		console.log(res);
	// 	};
	// 	a();
	// }, [login]);

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
