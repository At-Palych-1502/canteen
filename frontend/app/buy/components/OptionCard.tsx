import React from 'react';
import Styles from '../page.module.css';
import { IBuyOption } from '@/app/tools/types/mock';

interface Props {
	id: number,
	name: string,
	description: string,
	isSelected: boolean;
	onClick: () => void;
}

export const OptionCard: React.FC<Props> = ({
	id,
	name,
	description,
	isSelected,
	onClick,
}) => {
	return (
		<div
			key={id}
			className={`${Styles['option-card']} ${isSelected ? Styles.selected : ''}`}
			onClick={onClick}
		>
			<div className={Styles['option-header']}>
				<span className={Styles['option-name']}>{name}</span>
			</div>
			<p className={Styles['option-description']}>{description}</p>
			
		</div>
	);
};
