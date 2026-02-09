import React, { useEffect } from 'react';
import Styles from './IngredientEditModal.module.css';
import { useCreateIngredientMutation } from '@/app/tools/redux/api/ingredients';
import { IIngredientArg } from '@/app/tools/types/ingredients';

interface Props {
	onClose: (update: boolean) => void;
}

const IngredientsCreateModal = ({ onClose }: Props) => {
	const [createIngredient] = useCreateIngredientMutation();

	const [formData, setFormData] = React.useState<IIngredientArg | null>(null);

	useEffect(() => {
		setFormData({ name: '' });
	}, []);

	if (!formData) return null;

	const handleChange = (
		field: keyof IIngredientArg,
		value: string | number,
	) => {
		setFormData(prev => (prev ? { ...prev, [field]: value } : null));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await createIngredient(formData);

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
						<label>Название</label>
						<input
							type='text'
							value={formData.name}
							onChange={e => handleChange('name', e.target.value)}
						/>
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
		</div>
	);
};

export default IngredientsCreateModal;
