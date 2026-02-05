import { AuthForm } from '../AuthForm/AuthForm';
import Styles from './Popup.module.css';

interface Props {
	closePopup: VoidFunction;
	children: React.ReactNode;
}

export function Popup(props: Props) {
	return (
		<>
			<div onClick={props.closePopup} className={Styles['blur']}></div>
			<div className={Styles['main']}>{props.children}</div>
		</>
	);
}
