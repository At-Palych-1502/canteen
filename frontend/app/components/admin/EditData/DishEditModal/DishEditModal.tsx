import React, { useEffect } from 'react';
import { IDishExtended } from '@/app/tools/types/mock';
import Styles from './DishEditModal.module.css';

interface DishEditModalProps {
	dish: IDishExtended | null;
	onClose: () => void;
	onSave: (dish: IDishExtended) => void;
}

const DishEditModal: React.FC<DishEditModalProps> = ({
	dish,
	onClose,
	onSave,
}) => {
	const [formData, setFormData] = React.useState<IDishExtended | null>(null);

	useEffect(() => {
		setFormData(dish);
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
		if (formData) onSave(formData);
	};

	return (
		<div className={Styles.overlay} onClick={onClose}>
			<div className={Styles.modal} onClick={e => e.stopPropagation()}>
				<div className={Styles.header}>
					<h2>Редактирование блюда</h2>
					<button onClick={onClose} className={Styles.closeBtn}>
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
					<div className={Styles.field}>
						<label>Описание</label>
						<input
							type='text'
							value={formData.description || ''}
							onChange={e => handleChange('description', e.target.value)}
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
								onChange={e => handleChange('quantity', Number(e.target.value))}
							/>
						</div>
					</div>
					<div className={Styles.row}>
						<div className={Styles.field}>
							<label>Цена (₽)</label>
							<input
								type='number'
								value={formData.price}
								onChange={e => handleChange('price', Number(e.target.value))}
							/>
						</div>
						<div className={Styles.field}>
							<label>Тип</label>
							<select
								value={formData.type}
								onChange={e => handleChange('type', e.target.value)}
							>
								<option value='breakfast'>Завтрак</option>
								<option value='lunch'>Обед</option>
								<option value='dinner'>Полдник</option>
							</select>
						</div>
					</div>
					<div className={Styles.field}>
						<label>
							<input
								type='checkbox'
								checked={formData.available}
								onChange={e => handleChange('available', e.target.checked)}
							/>
							Доступно
						</label>
					</div>
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

export default DishEditModal;
