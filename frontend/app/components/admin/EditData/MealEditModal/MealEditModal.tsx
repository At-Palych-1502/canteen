import React, { useEffect, useState } from 'react';
import {
	IDailyMeals,
	IComplexMeal,
	IDishExtended,
} from '@/app/tools/types/mock';
import { mockDishes } from '@/app/tools/mockData';
import Styles from './MealEditModal.module.css';

interface MealEditModalProps {
	meal: IDailyMeals | null;
	onClose: () => void;
	onSave: (meal: IDailyMeals) => void;
}

const MealEditModal: React.FC<MealEditModalProps> = ({
	meal,
	onClose,
	onSave,
}) => {
	const [formData, setFormData] = React.useState<IDailyMeals | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [showDishSelector, setShowDishSelector] = useState<
		'breakfast' | 'lunch' | 'dinner' | null
	>(null);
	const [filteredDishes, setFilteredDishes] = useState<IDishExtended[]>([]);

	useEffect(() => {
		setFormData(meal);
	}, [meal]);

	useEffect(() => {
		if (searchTerm) {
			const filtered = mockDishes.filter(dish =>
				dish.name.toLowerCase().includes(searchTerm.toLowerCase()),
			);
			setFilteredDishes(filtered);
		} else {
			setFilteredDishes(mockDishes);
		}
	}, [searchTerm]);

	if (!meal || !formData) return null;

	const handleComplexMealChange = (
		type: 'breakfast' | 'lunch' | 'dinner',
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

	const handleRemoveDish = (
		type: 'breakfast' | 'lunch' | 'dinner',
		dishId: number,
	) => {
		setFormData(prev => {
			if (!prev) return null;
			return {
				...prev,
				[type]: {
					...prev[type],
					dishes: prev[type].dishes.filter(d => d.id !== dishId),
				},
			};
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (formData) onSave(formData);
	};

	return (
		<div className={Styles.overlay} onClick={onClose}>
			<div className={Styles.modal} onClick={e => e.stopPropagation()}>
				<div className={Styles.header}>
					<h2>Редактирование: {formData.date}</h2>
					<button onClick={onClose} className={Styles.closeBtn}>
						&times;
					</button>
				</div>
				<form onSubmit={handleSubmit} className={Styles.form}>
					{(['breakfast', 'lunch', 'dinner'] as const).map(type => (
						<div key={type} className={Styles.section}>
							<div className={Styles.sectionHeader}>
								<h4 className={Styles.sectionTitle}>
									{type === 'breakfast'
										? 'Завтрак'
										: type === 'lunch'
											? 'Обед'
											: 'Полдник'}
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
										value={formData[type].name}
										onChange={e =>
											handleComplexMealChange(type, 'name', e.target.value)
										}
									/>
								</div>
								<div className={Styles.field}>
									<label>Описание</label>
									<input
										type='text'
										value={formData[type].description}
										onChange={e =>
											handleComplexMealChange(
												type,
												'description',
												e.target.value,
											)
										}
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
											handleComplexMealChange(
												type,
												'price',
												Number(e.target.value),
											)
										}
									/>
								</div>
								<div className={Styles.field}>
									<label>Калории</label>
									<input
										type='number'
										value={formData[type].calories}
										onChange={e =>
											handleComplexMealChange(
												type,
												'calories',
												Number(e.target.value),
											)
										}
									/>
								</div>
							</div>
							<div className={Styles.dishesList}>
								<label>Блюда:</label>
								{formData[type].dishes.map(dish => (
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
											const isAdded = formData[type].dishes.some(
												d => d.id === dish.id,
											);
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
							onClick={onClose}
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
