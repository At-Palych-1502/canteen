import React, { useEffect, useState } from 'react';
import {
	IDailyMeals,
	IComplexMeal,
	IDishExtended,
} from '@/app/tools/types/mock';
import { mockDishes } from '@/app/tools/mockData';
import Styles from './MealEditModal.module.css';
import { IMeal } from '@/app/tools/types/meals';
import { IDish } from '@/app/tools/types/dishes';
import { days } from '@/app/config/format';

interface MealEditModalProps {
	meal: IMeal | null;
	dishes: IDish[];
	onClose: (update: boolean) => void;
}

const MealEditModal: React.FC<MealEditModalProps> = ({
	meal,
	dishes,
	onClose,
}) => {
	console.log(meal, dishes);

	const [formData, setFormData] = React.useState<{
		breakfast: IMeal;
		lunch: IMeal;
	} | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [showDishSelector, setShowDishSelector] = useState<
		'breakfast' | 'lunch' | null
	>(null);
	const [filteredDishes, setFilteredDishes] = useState<IDish[]>([]);

	useEffect(() => {
		setFormData(meal);
	}, [meal]);

	useEffect(() => {
		if (searchTerm) {
			const filtered = dishes.filter(dish =>
				dish.name.toLowerCase().includes(searchTerm.toLowerCase()),
			);
			setFilteredDishes(filtered);
		} else {
			setFilteredDishes(mockDishes);
		}
	}, [searchTerm, dishes]);

	if (!meal || !formData) return null;

	const handleComplexMealChange = (
		type: 'breakfast' | 'lunch',
		field: keyof IComplexMeal,
		value: string | number,
	) => {
		setFormData(prev => {
			if (!prev) return null;
			return {
				...prev,
				[type]: {
					...prev[type],
					[field]: value,
				},
			};
		});
	};

	const handleAddDish = (dishId: number) => {
		const dish = mockDishes.find(d => d.id === dishId);
		if (!dish || !showDishSelector) return;

		setFormData(prev => {
			if (!prev) return null;
			const existingDishes = prev[showDishSelector].dishes;
			const dishExists = existingDishes.some(d => d.id === dishId);

			if (dishExists) return prev;

			const newDish = {
				id: dish.id,
				name: dish.name,
				weight: dish.weight,
				price: dish.price,
			};
			return {
				...prev,
				[showDishSelector]: {
					...prev[showDishSelector],
					dishes: [...existingDishes, newDish],
				},
			};
		});
		setSearchTerm('');
	};

	const handleRemoveDish = (type: 'breakfast' | 'lunch', dishId: number) => {
		setFormData(prev => {
			if (!prev) return null;
			return {
				...prev,
				[type]: {
					...prev,
					dishes: prev.dishes.filter(d => d.id !== dishId),
				},
			};
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log(formData);

		// if (formData) onSave(formData);
	};

	return (
		<div className={Styles.overlay} onClick={() => onClose(false)}>
			<div className={Styles.modal} onClick={e => e.stopPropagation()}>
				<div className={Styles.header}>
					<h2>Редактирование: {days[formData.day_of_week]}</h2>
					<button onClick={() => onClose(false)} className={Styles.closeBtn}>
						&times;
					</button>
				</div>
				<form onSubmit={handleSubmit} className={Styles.form}>
					{(['breakfast', 'lunch'] as const).map(type => (
						<div key={type} className={Styles.section}>
							<div className={Styles.sectionHeader}>
								<h4 className={Styles.sectionTitle}>
									{type === 'breakfast' ? 'Завтрак' : 'Обед'}
								</h4>
								<button
									type='button'
									onClick={() => setShowDishSelector(type)}
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
										value={formData.name}
										onChange={e =>
											handleComplexMealChange(type, 'name', e.target.value)
										}
									/>
								</div>
							</div>
							<div className={Styles.row}>
								<div className={Styles.field}>
									<label>Цена</label>
									<input
										type='number'
										value={formData.price}
										onChange={e =>
											handleComplexMealChange(
												type,
												'price',
												Number(e.target.value),
											)
										}
									/>
								</div>
							</div>
							<div className={Styles.dishesList}>
								<label>Блюда:</label>
								{dishes.map(dish => (
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
								))}
							</div>
							{showDishSelector === type && (
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
											const isAdded = dishes.some(d => d.id === dish.id);
											return (
												<div
													key={dish.id}
													onClick={() => !isAdded && handleAddDish(dish.id)}
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
											setShowDishSelector(null);
											setSearchTerm('');
										}}
										className={Styles.cancelBtn}
									>
										Отмена
									</button>
								</div>
							)}
						</div>
					))}
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
};

export default MealEditModal;
