"use client"

import { useEffect } from 'react';
import Styles from './Popup.module.css';

interface Props {
	closePopup: VoidFunction;
	children: React.ReactNode;
	isOpen: boolean
}

export function Popup(props: Props) {
	
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		
		return () => {
			document.body.style.overflow = '';
		}
	}, []);

	const close = () => {
		props.closePopup();
	}

	return (
		<>
			<div onClick={close} className={Styles['blur']}></div>
			<div className={Styles['main']}>{props.children}</div>
		</>
	);
}
