import React from 'react';
import Styles from './CreateReportButton.module.css';

interface CreateReportButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

const CreateReportButton: React.FC<CreateReportButtonProps> = ({
	onClick,
	disabled = false,
}) => {
	return (
		<button
			className={`${Styles.button} ${disabled ? Styles.disabled : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			<span className={Styles.icon}>📊</span>
			<span className={Styles.text}>Создать отчёт</span>
		</button>
	);
};

export default CreateReportButton;
