'use client';

import React, { useEffect, useState } from 'react';
import Styles from './page.module.css';
import { mockAllergies } from '@/app/tools/mockData';
import { IAllergy } from '@/app/tools/types/mock';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectUser } from '../tools/redux/user';

export default function AllergiesPage() {
	const [allergies, setAllergies] = useState<IAllergy[]>(mockAllergies);
	const [saved, setSaved] = useState(false);

	const router = useRouter();
	const User = useSelector(selectUser);

	useEffect(() => {
		if (User && User.role !== 'student') router.push('/');
	}, [User, router]);

	const toggleAllergy = (id: number) => {
		setAllergies(
			allergies.map(allergy =>
				allergy.id === id ? { ...allergy, checked: !allergy.checked } : allergy,
			),
		);
	};

	const handleSave = () => {
		// Здесь будет логика отправки данных на сервер
		const selectedAllergies = allergies.filter(a => a.checked);
		console.log('Saved allergies:', selectedAllergies);
		setSaved(true);
	};

	const handleReset = () => {
		setAllergies(mockAllergies.map(a => ({ ...a, checked: false })));
	};

	const handleBack = () => {
		setSaved(false);
	};

	if (saved) {
		return (
			<div className={Styles['allergies-container']}>
				<div className={Styles['success-message']}>
					<h2>Данные сохранены!</h2>
					<p>
						Ваши пищевые особенности успешно обновлены. Мы учтем их при
						формировании меню.
					</p>
					<button onClick={handleBack}>Вернуться к редактированию</button>
				</div>
			</div>
		);
	}

	const selectedCount = allergies.filter(a => a.checked).length;

	return (
		<div className={Styles['allergies-container']}>
			<div className={Styles['page-header']}>
				<h1>Пищевые особенности</h1>
				<p>Укажите аллергены и пищевые ограничения</p>
			</div>

			<div className={Styles['allergies-grid']}>
				{allergies.map(allergy => (
					<div
						key={allergy.id}
						className={`${Styles['allergy-card']} ${
							allergy.checked ? Styles.checked : ''
						}`}
						onClick={() => toggleAllergy(allergy.id)}
					>
						<div
							className={`${Styles['checkbox']} ${allergy.checked ? Styles.checked : ''}`}
						/>
						<span className={Styles['allergy-name']}>{allergy.name}</span>
					</div>
				))}
			</div>

			<div className={Styles['actions-section']}>
				<div className={Styles['actions-header']}>
					<h2>Действия</h2>
				</div>
				<div className={Styles['selected-count']}>
					Выбрано аллергенов: {selectedCount}
				</div>
				<div className={Styles['buttons-container']}>
					<button className={Styles['action-button']} onClick={handleReset}>
						Сбросить
					</button>
					<button
						className={`${Styles['action-button']} ${Styles.primary}`}
						onClick={handleSave}
					>
						Сохранить
					</button>
				</div>
			</div>
		</div>
	);
}
