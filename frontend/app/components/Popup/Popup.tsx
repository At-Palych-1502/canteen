import { useEffect } from 'react';
import Styles from './Popup.module.css';

interface Props {
	closePopup: VoidFunction;
	children: React.ReactNode;
}

export function Popup(props: Props) {
	useEffect(() => {
		document.body.style.overflow = 'hidden';
	}, []);

	const close = () => {
		document.body.style.overflow = '';
		props.closePopup();
	}

	return (
		<>
			<div onClick={close} className={Styles['blur']}></div>
			<div className={Styles['main']}>{props.children}</div>
		</>
	);
}
