'use client';

import { useEffect } from 'react';
import Styles from './page.module.css';
import { useGetUserQuery } from './tools/redux/api/auth';

import { useDispatch } from 'react-redux';
import { setUser } from './tools/redux/user';

export default function Home() {
	const { data, error: _, isLoading: __ } = useGetUserQuery();
	const dispatch = useDispatch();

	useEffect(() => {
		if (data) {
			dispatch(setUser(data.user));
		}
	}, [data, dispatch]);

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
