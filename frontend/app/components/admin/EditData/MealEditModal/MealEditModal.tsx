import React, { useEffect, useState } from 'react';
import Styles from './MealEditModal.module.css';
import { IMeal } from '@/app/tools/types/meals';
import { IDish } from '@/app/tools/types/dishes';
import { days, daysIndex } from '@/app/config/format';
import {
	useCreateMealMutation,
	useDeleteMealMutation,
	useUpdateMealMutation,
} from '@/app/tools/redux/api/meals';

interface MealEditModalProps {
	day: number;
	meals: IMeal[];
	dishes: IDish[];
	onClose: (update: boolean) => void;
}

type Type = 'breakfast' | 'lunch';
interface FormData {
	breakfast: IMeal | null;
	lunch: IMeal | null;
}

const MealEditModal: React.FC<MealEditModalProps> = ({
	day,
	meals,
	dishes,
	onClose,
}) => {
	const [updateMeal] = useUpdateMealMutation();
	const [createMeal] = useCreateMealMutation();
	const [removeMeal] = useDeleteMealMutation();

	const [formData, setFormData] = React.useState<FormData>({
		breakfast: null,
		lunch: null,
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredDishes, setFilteredDishes] = useState<IDish[]>([]);
	const [showDishSelector, setShowDishSelector] = useState<{
		breakfast: boolean;
		lunch: boolean;
	}>({ breakfast: false, lunch: false });

	useEffect(() => {
		const todayMeals = meals.filter(m => m.day_of_week === days[day]);

		setFormData({
			breakfast: todayMeals.find(m => m.type === 'breakfast') || null,
			lunch: todayMeals.find(m => m.type === 'lunch') || null,
		});
	}, [meals, day]);

	console.log(formData);

	useEffect(() => {
		if (searchTerm) {
			const filtered = dishes.filter(dish =>
				dish.name.toLowerCase().includes(searchTerm.toLowerCase()),
			);
			setFilteredDishes(filtered);
		} else {
			setFilteredDishes(dishes);
		}
	}, [searchTerm, dishes]);

	const handleAddDish = (type: Type, dishId: number) => {
		const dish = dishes.find(d => d.id === dishId);
		if (!dish || !showDishSelector) return;

		setFormData(prev => {
			if (!prev || !prev[type]) return { breakfast: null, lunch: null };
			const existingDishes = prev[type].dishes;
			const dishExists = existingDishes.some(d => d.id === dishId);

			if (dishExists) return prev;

			const newDish = {
				...dish,
			};
			return {
				...prev,
				[type]: {
					...prev[type],
					dishes: [...existingDishes, newDish],
				},
			};
		});
		setSearchTerm('');
	};

	const handleRemoveDish = (type: Type, dishId: number) => {
		setFormData(prev => {
			if (!prev || !prev[type]) return { breakfast: null, lunch: null };

			return {
				...prev,
				[type]: {
					...prev[type],
					dishes: prev[type].dishes.filter(d => d.id !== dishId),
				},
			};
		});
	};

	const handleChange = (
		type: Type,
		field: keyof IMeal,
		value: string | number | boolean,
	) => {
		setFormData(prev =>
			prev
				? {
						...prev,
						[type]: {
							...prev[type],
							[field]: value,
						},
					}
				: { breakfast: null, lunch: null },
		);
	};

	const handleAddBlankMeal = (type: Type) => {
		setFormData(prev =>
			prev
				? {
						...prev,
						[type]: {
							name: '',
							price: 0,
							type,
							day_of_week: days[day],
							dishes: [],
						},
					}
				: { breakfast: null, lunch: null },
		);
	};

	const handleRemoveMeal = (type: Type) => {
		setFormData(prev =>
			prev
				? {
						...prev,
						[type]: null,
					}
				: { breakfast: null, lunch: null },
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const todayMeals = meals.filter(m => m.day_of_week === days[day]);

		const todayBreakfast = todayMeals.find(m => m.type === 'breakfast') || null;
		const todayLunch = todayMeals.find(m => m.type === 'lunch') || null;

		const today = { breakfast: todayBreakfast, lunch: todayLunch };

		console.log(formData);
		console.log(todayMeals);

		(['breakfast', 'lunch'] as const).map(type => {
			if (formData[type]) {
				const { id, ...newData } = formData[type];
				if (today[type]) {
					updateMeal({
						id,
						data: {
							...newData,
							dishes: formData[type].dishes.map(d => d.id),
						},
					});
				}
			}
		});
	};

	return (
		<div className={Styles.overlay} onClick={() => onClose(false)}>
			<div className={Styles.modal} onClick={e => e.stopPropagation()}>
				<div className={Styles.header}>
					<h2>Редактирование: {daysIndex[day]}</h2>
					<button onClick={() => onClose(false)} className={Styles['closeBtn']}>
						&times;
					</button>
				</div>
				<form onSubmit={handleSubmit} className={Styles.form}>
					{(['breakfast', 'lunch'] as const).map(type =>
						!formData[type] ? (
							<button
								className={Styles['addButton']}
								key={type}
								onClick={() => handleAddBlankMeal(type)}
							>
								Добавить {type === 'breakfast' ? 'завтрак' : 'обед'}
							</button>
						) : (
							<div key={type} className={Styles.section}>
								<div className={Styles.sectionHeader}>
									<h4 className={Styles.sectionTitle}>
										<span>{type === 'breakfast' ? 'Завтрак' : 'Обед'}</span>
										<button
											className={Styles['removeButton']}
											onClick={() => handleRemoveMeal(type)}
										>
											Удалить {type === 'breakfast' ? 'завтрак' : 'обед'}
										</button>
									</h4>
									<button
										type='button'
										onClick={() =>
											setShowDishSelector({ ...showDishSelector, [type]: true })
										}
										className={Styles.addDishBtn}
									>
										+ Добавить блюдо
									</button>
								</div>
								<div className={Styles.row}>
									<div className={Styles.field}>
										<label>Название</label>
										<input
											type='text'
											value={formData[type].name}
											onChange={e => handleChange(type, 'name', e.target.value)}
										/>
									</div>
								</div>
								<div className={Styles.row}>
									<div className={Styles.field}>
										<label>Цена</label>
										<input
											type='number'
											value={formData[type].price}
											onChange={e =>
												handleChange(type, 'price', Number(e.target.value))
											}
										/>
									</div>
								</div>
								<div className={Styles.dishesList}>
									<label>Блюда:</label>
									{!formData[type].dishes ? (
										<p>Не удалось загрузить</p>
									) : (
										formData[type].dishes.map(dish => (
											<div key={dish.id} className={Styles.dishItem}>
												<span>
													{dish.name} ({dish.weight}г)
												</span>
												<button
													type='button'
													onClick={() => handleRemoveDish(type, dish.id)}
													className={Styles.removeDishBtn}
												>
													&times;
												</button>
											</div>
										))
									)}
								</div>
								{showDishSelector[type] === true && (
									<div className={Styles.dishSelector}>
										<input
											type='text'
											placeholder='Поиск блюда...'
											value={searchTerm}
											onChange={e => setSearchTerm(e.target.value)}
											className={Styles.searchInput}
											autoFocus
										/>
										<div className={Styles.dishOptions}>
											{filteredDishes.map(dish => {
												const isAdded = (
													formData[type] || { dishes: [] }
												).dishes.some(d => d.id === dish.id);
												return (
													<div
														key={dish.id}
														onClick={() =>
															!isAdded && handleAddDish(type, dish.id)
														}
														className={`${Styles.dishOption} ${isAdded ? Styles.dishOptionDisabled : ''}`}
													>
														{dish.name}
														{isAdded && (
															<span className={Styles.addedBadge}>✓</span>
														)}
													</div>
												);
											})}
										</div>
										<button
											type='button'
											onClick={() => {
												setShowDishSelector({
													...showDishSelector,
													[type]: false,
												});
												setSearchTerm('');
											}}
											className={Styles.cancelBtn}
										>
											Отмена
										</button>
									</div>
								)}
							</div>
						),
					)}
					<div className={Styles.actions}>
						<button
							type='button'
							onClick={() => onClose(false)}
							className={Styles.cancelBtn}
						>
							Отмена
						</button>
						<button type='submit' className={Styles.saveBtn}>
							Сохранить
						</button>
					</div>
				</form>
			</div>
		</div>
	);

	return <p>ad</p>;
};

export default MealEditModal;
