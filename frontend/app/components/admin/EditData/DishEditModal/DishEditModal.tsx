import React, { useEffect, useState } from 'react';
import Styles from './DishEditModal.module.css';
import { IDish } from '@/app/tools/types/dishes';
import {
	useDeleteDishMutation,
	useGetDishByIdQuery,
	useUpdateDishMutation,
} from '@/app/tools/redux/api/dishes';
import { IIngredient } from '@/app/tools/types/ingredients';

interface DishEditModalProps {
	id: number;
	ingredients: IIngredient[];
	onClose: (update: boolean) => void;
}

const DishEditModal: React.FC<DishEditModalProps> = ({
	id,
	ingredients,
	onClose,
}) => {
	const [updateDish] = useUpdateDishMutation();
	const [removeDish] = useDeleteDishMutation();

	const { data: dish, isLoading, refetch } = useGetDishByIdQuery(id);
	const [formData, setFormData] = React.useState<IDish | null>(null);

	const [showIngredientsSelector, setShowIngredientsSelector] = useState(false);

	const [filteredIngredients, setFilteredIngredients] = useState<IIngredient[]>(
		[],
	);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		if (typeof dish !== 'undefined') setFormData(dish.data);
		if (typeof ingredients !== 'undefined') setFilteredIngredients(ingredients);
	}, [dish, ingredients]);

	useEffect(() => {
		if (searchTerm !== '') {
			const filtered = ingredients.filter(dish =>
				dish.name.toLowerCase().includes(searchTerm.toLowerCase()),
			);
			setFilteredIngredients(filtered);
		} else {
			setFilteredIngredients(ingredients || []);
		}
	}, [searchTerm, ingredients, dish]);

	if (!dish || !formData) return null;

	const handleChange = (
		field: keyof IDish,
		value: string | number | boolean,
	) => {
		setFormData(prev => (prev ? { ...prev, [field]: value } : null));
	};

	const handleRemoveIngredient = (ingredientId: number) => {
		setFormData(prev => {
			if (!prev) return null;

			return {
				...prev,
				ingredients: (prev.ingredients || []).filter(
					d => d.id !== ingredientId,
				),
			};
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const { id, ...data } = formData;

		updateDish({
			id,
			data: {
				...data,
				ingredients: Array.from(data.ingredients || []).map(i => i.id),
			},
		});

		onClose(true);
		refetch();
	};

	const handleAddIngredient = (ingredientId: number) => {
		const ingredient = ingredients.find(d => d.id === ingredientId);

		if (!ingredient || !showIngredientsSelector) return;

		setFormData(prev => {
			if (!prev) return null;
			const existingIngredients = prev.ingredients;
			const ingredientExists = (formData.ingredients || []).some(
				d => d.id === ingredientId,
			);

			if (ingredientExists || !existingIngredients) return prev;

			const newIngredient: IIngredient = {
				id: ingredient.id,
				name: ingredient.name,
				quantity: ingredient.quantity,
			};

			return {
				...prev,
				ingredients: [...existingIngredients, newIngredient],
			};
		});
		setSearchTerm('');
	};

	const handleRemove = (id: number) => {
		removeDish(id);
		onClose(true);
	};

	return (
		<div className={Styles.overlay} onClick={() => onClose(false)}>
			{isLoading ? (
				<p>Загрузка...</p>
			) : (
				<div className={Styles.modal} onClick={e => e.stopPropagation()}>
					<div className={Styles.header}>
						<h2>Редактирование блюда</h2>
						<button onClick={() => onClose(false)} className={Styles.closeBtn}>
							&times;
						</button>
					</div>
					<form onSubmit={handleSubmit} className={Styles.form}>
						<div className={Styles.field}>
							<label>Название</label>
							<input
								type='text'
								value={formData.name}
								onChange={e => handleChange('name', e.target.value)}
							/>
						</div>
						<div className={Styles.row}>
							<div className={Styles.field}>
								<label>Вес (г)</label>
								<input
									type='number'
									value={formData.weight}
									onChange={e => handleChange('weight', Number(e.target.value))}
								/>
							</div>
						</div>
						<div className={Styles['ingredients']}>
							<div className={Styles.ingredientsList}>
								<label>Ингридиенты:</label>
								<div className={Styles['ingredientsWrapper']}>
									{!formData.ingredients ? (
										<p>Не удалось загрузить ингридиенты</p>
									) : (
										formData.ingredients.map(ingredient => (
											<div
												key={ingredient.id}
												className={Styles.ingredientItem}
											>
												<span>{ingredient.name}</span>
												<button
													type='button'
													onClick={() => handleRemoveIngredient(ingredient.id)}
													className={Styles.removeIngredientBtn}
												>
													&times;
												</button>
											</div>
										))
									)}
								</div>
							</div>
							<div className={Styles['addIngredients']}>
								<button
									type='button'
									onClick={() => setShowIngredientsSelector(true)}
									className={Styles.addIngredientBtn}
								>
									+ Добавить ингридиент
								</button>
								{showIngredientsSelector === true && (
									<div className={Styles.ingredientsSelector}>
										<input
											type='text'
											placeholder='Поиск ингридиента...'
											value={searchTerm}
											onChange={e => setSearchTerm(e.target.value)}
											className={Styles.searchInput}
											autoFocus
										/>
										<div className={Styles.ingredientsOptions}>
											{filteredIngredients.map(ingredient => {
												const isAdded = (formData.ingredients || []).some(
													d => d.id === ingredient.id,
												);

												return (
													<div
														key={ingredient.id}
														onClick={() =>
															!isAdded && handleAddIngredient(ingredient.id)
														}
														className={`${Styles.ingredientsOption} ${isAdded ? Styles.ingredientsOptionDisabled : ''}`}
													>
														{ingredient.name}
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
												setShowIngredientsSelector(false);
												setSearchTerm('');
											}}
											className={Styles.cancelBtn}
										>
											Отмена
										</button>
									</div>
								)}
							</div>
						</div>
						<div className={Styles.actions}>
							<button
								type='button'
								onClick={() => handleRemove(dish.data.id)}
								className={Styles.saveBtn}
							>
								Удалить
							</button>
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
			)}
		</div>
	);
};

export default DishEditModal;
