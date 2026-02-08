'use client';

import React from 'react';
import Styles from './DaySelector.module.css';

interface Props {
	selectedDay: number;
	onDayChange: (day: number) => void;
}

const DaySelector = ({ selectedDay, onDayChange }: Props) => {
	const days = [
		{ id: 0, name: 'Понедельник', short: 'Пн' },
		{ id: 1, name: 'Вторник', short: 'Вт' },
		{ id: 2, name: 'Среда', short: 'Ср' },
		{ id: 3, name: 'Четверг', short: 'Чт' },
		{ id: 4, name: 'Пятница', short: 'Пт' },
		{ id: 5, name: 'Суббота', short: 'Сб' },
		{ id: 6, name: 'Воскресенье', short: 'Вс' },
	];

	const today = new Date().getDay();
	const adjustedToday = today === 0 ? 6 : today - 1;

	return (
		<div className={Styles['day-selector']}>
			<div className={Styles['day-selector-container']}>
				{days.map(day => (
					<button
						key={day.id}
						className={`${Styles['day-button']} ${
							selectedDay === day.id ? Styles.active : ''
						} ${day.id === adjustedToday ? Styles.today : ''}`}
						onClick={() => onDayChange(day.id)}
						title={day.name}
					>
						{day.short}
						{day.id === adjustedToday && (
							<span className={Styles['today-dot']} />
						)}
					</button>
				))}
			</div>
		</div>
	);
};

export default DaySelector;
