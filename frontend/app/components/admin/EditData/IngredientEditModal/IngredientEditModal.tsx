import React, { useEffect } from 'react';
import Styles from './IngredientEditModal.module.css';
import {
	useDeleteIngredientMutation,
	useUpdateIngredientMutation,
} from '@/app/tools/redux/api/ingredients';
import { IIngredient } from '@/app/tools/types/ingredients';

interface IngredientEditModalProps {
	ingredient: IIngredient | null;
	onClose: (update: boolean) => void;
}

const IngredientEditModal: React.FC<IngredientEditModalProps> = ({
	ingredient,
	onClose,
}) => {
	const [updateIngredient, { isLoading: isUpdateLoading }] =
		useUpdateIngredientMutation();
	const [removeIngredient] = useDeleteIngredientMutation();

	const [formData, setFormData] = React.useState<IIngredient | null>(null);

	useEffect(() => {
		setFormData(ingredient);
	}, [ingredient]);

	if (!ingredient || !formData) return null;

	const handleChange = (field: keyof IIngredient, value: string | number) => {
		setFormData(prev => (prev ? { ...prev, [field]: value } : null));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { id, ...data } = formData;

		await updateIngredient({ id, data });

		onClose(true);
	};

	const handleRemove = (id: number) => {
		removeIngredient(id);

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
					<div className={Styles.actions}>
						<button
							type='button'
							onClick={() => handleRemove(ingredient.id)}
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
		</div>
	);
};

export default IngredientEditModal;
