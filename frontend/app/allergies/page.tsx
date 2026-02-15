'use client';

import React, { useEffect, useState } from 'react';
import Styles from './page.module.css';
import { mockAllergies } from '@/app/tools/mockData';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectUser } from '../tools/redux/user';
import { useAddAllergyMutation, useDeleteAllergyMutation, useGetAllergiesQuery } from '../tools/redux/api/allergies';

export default function AllergiesPage() {
	const [checkedAllergies, setCheckAllergies] = useState<number[]>([]); //Массив id отмеченных аллергий
	const [saved, setSaved] = useState(false);

	const ingredients = useGetAllergiesQuery();
	const [addAllergy] = useAddAllergyMutation();
	const [deleteAllergy] = useDeleteAllergyMutation();

	const router = useRouter();
	const User = useSelector(selectUser);

	useEffect(() => {
		setCheckAllergies(ingredients.data?.allergies.map(i => i.id) ?? []);
	}, [ingredients.isLoading])

	useEffect(() => {
		if (!User || User.role !== 'student') router.push('/');
	}, [User, router]);

	const toggleAllergy = (id: number) => {
		if (checkedAllergies.find(i => i === id)) {
			setCheckAllergies(checkedAllergies.filter(i => i !== id));
		} else {
			setCheckAllergies([...checkedAllergies, id]);
		}
	};

	const handleSave = () => {
		const allIngridients = ingredients.data?.ingredients;
		const allergies = ingredients.data?.allergies;
		if (!allIngridients || !allergies) return;

		allIngridients.forEach(item => {
			const isInAllergies = allergies.find(i => i.id === item.id);
			const isInCheckedAllergies = checkedAllergies.find(i => i === item.id);

			if (isInAllergies && !isInCheckedAllergies) {
				deleteAllergy(item.id);
			} else if (!isInAllergies && isInCheckedAllergies) {
				addAllergy(item.id);
			}
		})

		setSaved(true);
		ingredients.refetch();
	};

	const handleReset = () => {
		setCheckAllergies(ingredients.data?.allergies.map(i => i.id) ?? []);
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

	const selectedCount = checkedAllergies.length;

	return (
		<div className={Styles['allergies-container']}>
			<div className={Styles['page-header']}>
				<h1>Пищевые особенности</h1>
				<p>Укажите аллергены и пищевые ограничения</p>
			</div>

			<div className={Styles['allergies-grid']}>
				{!ingredients.isLoading && ingredients.data?.ingredients.map(ingridient => {
					const isChecked = checkedAllergies.find(i => i === ingridient.id);
					return (
						<div
							key={ingridient.id}
							className={`${Styles['allergy-card']} ${
								isChecked ? Styles.checked : ''
							}`}
							onClick={() => toggleAllergy(ingridient.id)}
						>
							<div
								className={`${Styles['checkbox']} ${isChecked ? Styles.checked : ''}`}
							/>
							<span className={Styles['allergy-name']}>{ingridient.name}</span>
						</div>
				)})}
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
