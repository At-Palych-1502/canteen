'use client';

import { useEffect } from 'react';
import Styles from './page.module.css';
import { useGetUserQuery } from './tools/redux/api/auth';

import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from './tools/redux/user';
import { IUser } from './tools/types/user';
import CurrentOrders from './components/student/CurrentOrder/CurrentOrders';
import UsersTable from './components/admin/UsersTable/UsersTable/UsersTable';
import { OrdersForCook } from './components/student/CurrentOrder/OrdersForCook';

export default function Home() {
	const { data, isLoading } = useGetUserQuery();
	const dispatch = useDispatch();
	const User: IUser | null = useSelector(selectUser);

	useEffect(() => {
		if (data) {
			dispatch(setUser(data.user));
		}
	}, [data, dispatch]);

	return (
		<>
			<section className={Styles['section']}>
				{isLoading ? (
					<h3>Загрузка...</h3>
				) : User ? (
					User.role === 'admin' ? (
						<UsersTable />
					) : User.role === 'student' ? (
						<CurrentOrders />
					) : (
						<OrdersForCook />
					)
				) : (
					<div className={Styles['title-wrapper']}>
						<div className={Styles['title_section']}>
							<h1 className={Styles['title_section__title']}>
								Школьная столовая
							</h1>
							<h4 className={Styles['title_section__description']}>
								Удобный контроль питания для учеников и администрации
							</h4>
						</div>
						<div className={Styles['ability_section']}>
							<h2 className={Styles['ability_section__title']}>
								Возможности сервиса
							</h2>
							<div className={Styles['container']}>
								<h3>Покупать питание</h3>
								<h3>Удобный просмотр меню</h3>
								<h3>Отзывы о питании</h3>
							</div>
						</div>
					</div>
				)}
			</section>
		</>
	);
}
