'use client';

import { loginUser } from '@/app/tools/auth';
import { FocusEvent, FormEvent, useEffect, useState } from 'react';
import Styles from './AuthFrom.module.css';

interface Props {
	closePopup: VoidFunction;
}

export function AuthForm(props: Props) {
	const [responseInfo, setResponseInfo] = useState({ text: '', ok: false });
	const [authInfo, setAuthInfo] = useState({ username: '', password: '' });

	const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await loginUser(authInfo);

		if (response.ok) {
			console.log(JSON.stringify(response.user)); //Записываем в локальное хранилище
			setResponseInfo({ text: 'Успешная авторизация', ok: true });
		} else {
			setResponseInfo({ text: 'Неверный логин или пароль', ok: false });
		}
	};

	useEffect(() => {
		const temp = setTimeout(() => {
			const ok = responseInfo.ok;
			setResponseInfo({ text: '', ok: false });

			if (ok) {
				props.closePopup();
			}
		}, 1300);

		return () => clearTimeout(temp);
	}, [responseInfo]);

	const inputHandler = (event: FocusEvent<HTMLInputElement, Element>) => {
		const temp = { ...authInfo, [event.target.name]: event.target.value };

		setAuthInfo(temp);
	};

	return (
		<div>
			<h1 className={Styles['title']}>Авторизация</h1>
			<form className={Styles['form']} onSubmit={onSubmitHandler}>
				<h3>Введите имя пользователя</h3>
				<input
					className={Styles['input']}
					onBlur={inputHandler}
					type='text'
					name='username'
				/>
				<h3>Введите пароль</h3>
				<input
					className={Styles['input']}
					onBlur={inputHandler}
					type='password'
					name='password'
				/>
				<button className={Styles['auth_button']} type='submit'>
					Авторизоваться
				</button>

				{responseInfo.text && (
					<h5
						className={`${Styles['response']} ${Styles[`${responseInfo.ok ? 'response_good' : 'response_bad'}`]}`}
					>
						{responseInfo.text}
					</h5>
				)}
			</form>
		</div>
	);
}
