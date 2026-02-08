import React from 'react';
import Styles from '../page.module.css';
import { IBuyOption } from '@/app/tools/types/mock';

interface Props {
	option: IBuyOption;
	isSelected: boolean;
	onClick: () => void;
}

export const OptionCard: React.FC<Props> = ({
	option,
	isSelected,
	onClick,
}) => {
	return (
		<div
			key={option.id}
			className={`${Styles['option-card']} ${isSelected ? Styles.selected : ''}`}
			onClick={onClick}
		>
			<div className={Styles['option-header']}>
				<span className={Styles['option-name']}>{option.name}</span>
				<span className={Styles['option-price']}>
					{option.price > 0 ? `${option.price} ₽` : ''}
				</span>
			</div>
			<p className={Styles['option-description']}>{option.description}</p>
			<span className={Styles['option-period']}>{option.period}</span>
		</div>
	);
};
