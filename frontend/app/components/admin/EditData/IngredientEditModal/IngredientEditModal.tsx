import React, { useEffect } from 'react';
import Styles from './IngredientEditModal.module.css';
import { useUpdateIngredientMutation } from '@/app/tools/redux/api/ingredients';

interface Ingredient {
	id: number;
	name: string;
}

interface IngredientEditModalProps {
	ingredient: Ingredient | null;
	onClose: (update: boolean) => void;
}

const IngredientEditModal: React.FC<IngredientEditModalProps> = ({
	ingredient,
	onClose,
}) => {
	const [updateIngredient, { error, isLoading: isUpdateLoading }] =
		useUpdateIngredientMutation();

	const [formData, setFormData] = React.useState<Ingredient | null>(null);

	useEffect(() => {
		setFormData(ingredient);
	}, [ingredient]);

	if (!ingredient || !formData) return null;

	const handleChange = (field: keyof Ingredient, value: string | number) => {
		setFormData(prev => (prev ? { ...prev, [field]: value } : null));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { id, ...data } = formData;

		await updateIngredient({ id, data });

		onClose(true);
	};

	return (
		<div className={Styles.overlay} onClick={() => onClose(false)}>
			<div className={Styles.modal} onClick={e => e.stopPropagation()}>
				<div className={Styles.header}>
					<h2>Редактирование ингредиента</h2>
					<button onClick={() => onClose(false)} className={Styles.closeBtn}>
						&times;
					</button>
				</div>
				<form onSubmit={handleSubmit} className={Styles.form}>
					<div className={Styles.field}>
						<label>ID</label>
						<input type='number' value={formData.id} disabled />
					</div>
					<div className={Styles.field}>
						<label>Название</label>
						<input
							type='text'
							value={formData.name}
							onChange={e => handleChange('name', e.target.value)}
						/>
					</div>
					{isUpdateLoading && <p>Обновление ингридиента...</p>}
					{isUpdateLoading && <p>Обновление ингридиента...</p>}
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

export default IngredientEditModal;
