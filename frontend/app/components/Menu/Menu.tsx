import React from 'react';
import Styles from './Menu.module.css';
import Meals from './Meals';

const Menu = () => {
	return (
		<div className={Styles['menu-container']}>
			<header>
				<h2>Меню</h2>
				<input type='text' placeholder='Поиск' />
			</header>
			<div className={Styles['container']}>
				<Meals type='breakfast' />
				<Meals type='lunch' />
				<Meals type='dinner' />
			</div>
		</div>
	);
};

export default Menu;
