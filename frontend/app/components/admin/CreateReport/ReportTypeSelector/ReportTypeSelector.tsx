import React from 'react';
import Styles from './ReportTypeSelector.module.css';

type ReportType = 'food' | 'finance' | 'food+finance';

interface ReportTypeSelectorProps {
	value: ReportType;
	onChange: (value: ReportType) => void;
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
	value,
	onChange,
}) => {
	const options: { value: ReportType; label: string; icon: string }[] = [
		{ value: 'food', label: 'Питание', icon: '🍽️' },
		{ value: 'finance', label: 'Финансы', icon: '💰' },
		{ value: 'food+finance', label: 'Питание + Финансы', icon: '📊' },
	];

	return (
		<div className={Styles.typeSelector}>
			<span className={Styles.label}>Тип отчёта:</span>
			<div className={Styles.options}>
				{options.map(option => (
					<button
						key={option.value}
						className={`${Styles.option} ${value === option.value ? Styles.active : ''}`}
						onClick={() => onChange(option.value)}
					>
						<span className={Styles.icon}>{option.icon}</span>
						<span className={Styles.optionLabel}>{option.label}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default ReportTypeSelector;
