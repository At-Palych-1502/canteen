import React, { useState } from 'react';
import Styles from './QuantityControl.module.css';

interface QuantityControlProps {
	value: number;
	remaining: number;
	onChange: (newValue: number) => void;
	disabled?: boolean;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
	remaining,
	value,
	onChange,
	disabled = false,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [inputValue, setInputValue] = useState(value.toString());

	const handleEditClick = () => {
		setIsEditing(true);
		setInputValue(value.toString());
	};

	const handleSaveClick = () => {
		const newValue = parseInt(inputValue, 10);
		if (!isNaN(newValue) && newValue > 0) {
			onChange(newValue);
		}
		setIsEditing(false);
	};

	const handleCancelClick = () => {
		setInputValue(value.toString());
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSaveClick();
		} else if (e.key === 'Escape') {
			handleCancelClick();
		}
	};

	if (isEditing) {
		return (
			<div className={Styles.editContainer}>
				<input
					type='number'
					className={Styles.input}
					value={inputValue}
					onChange={e => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					min='1'
					autoFocus
				/>
				<button
					className={`${Styles.button} ${Styles.saveButton}`}
					onClick={handleSaveClick}
				>
					✓
				</button>
				<button
					className={`${Styles.button} ${Styles.cancelButton}`}
					onClick={handleCancelClick}
				>
					✕
				</button>
			</div>
		);
	}

	return (
		<div className={Styles.displayContainer}>
			<span className={Styles.value}>
				{value} {!disabled && <>(Осталось {remaining})</>}
			</span>
			{!disabled && (
				<button
					className={Styles.editButton}
					onClick={handleEditClick}
					title='Изменить количество'
				>
					✎
				</button>
			)}
		</div>
	);
};

export default QuantityControl;
