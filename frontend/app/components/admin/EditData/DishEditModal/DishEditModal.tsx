import React, { useEffect } from 'react';
import { IDishExtended } from '@/app/tools/types/mock';
import Styles from './DishEditModal.module.css';
import { IDish } from '@/app/tools/types/dishes';
import {
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
	const [updateDish, { error, isLoading: isUpdateLoading }] =
		useUpdateDishMutation();

	console.log(error, isUpdateLoading);

	const { data: dish, isLoading } = useGetDishByIdQuery(id);
	const [formData, setFormData] = React.useState<IDish | null>(null);

	useEffect(() => {
		if (typeof dish !== 'undefined') setFormData(dish.data);
	}, [dish]);

	if (!dish || !formData) return null;

	const handleChange = (
		field: keyof IDishExtended,
		value: string | number | boolean,
	) => {
		setFormData(prev => (prev ? { ...prev, [field]: value } : null));
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
	};

	const handleRemoveIngredient = (id: number) => {
		console.log('удаление', id);
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
							<div className={Styles.field}>
								<label>Количество</label>
								<input
									type='number'
									value={formData.quantity}
									onChange={e =>
										handleChange('quantity', Number(e.target.value))
									}
								/>
							</div>
							<div className={Styles.ingredientsList}>
								<label>Ингридиенты:</label>
								{ingredients.map(ingredient => (
									<div key={ingredient.id} className={Styles.ingredientItem}>
										<span>{ingredient.name}</span>
										<button
											type='button'
											onClick={() => handleRemoveIngredient(ingredient.id)}
											className={Styles.removeIngredientBtn}
										>
											&times;
										</button>
									</div>
								))}
							</div>
							{/* {showDishSelector === type && (
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
							)} */}
						</div>
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
			)}
		</div>
	);
};

export default DishEditModal;
