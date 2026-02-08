import React from 'react';
import Styles from './DateSelector.module.css';

type DateOption = '1d' | '3d' | '7d';

interface DateSelectorProps {
	value: DateOption;
	onChange: (value: DateOption) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ value, onChange }) => {
	const options: { value: DateOption; label: string }[] = [
		{ value: '1d', label: '1 день' },
		{ value: '3d', label: '3 дня' },
		{ value: '7d', label: '7 дней' },
	];

	return (
		<div className={Styles.dateSelector}>
			<span className={Styles.label}>Период:</span>
			<div className={Styles.options}>
				{options.map(option => (
					<button
						key={option.value}
						className={`${Styles.option} ${value === option.value ? Styles.active : ''}`}
						onClick={() => onChange(option.value)}
					>
						{option.label}
					</button>
				))}
			</div>
		</div>
	);
};

export default DateSelector;
