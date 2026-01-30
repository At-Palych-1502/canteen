'use client';

import { loginUser } from '@/app/tools/auth';
import { FocusEvent, FormEvent, useEffect, useState } from 'react';
import Styles from './AuthFrom.module.css';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/app/tools/redux/api/auth';

interface Props {
	closePopup: VoidFunction;
}

interface Inputs {
	username: string;
	password: string;
}

export function AuthForm(props: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const [login] = useLoginMutation();

	console.log(errors);

	return (
		<div>
			<h1 className={Styles['title']}>Авторизация</h1>
			<form className={Styles['form']} onSubmit={handleSubmit(login)}>
				<label htmlFor='username'>
					<h3>Введите имя пользователя</h3>
					<input
						className={Styles['input']}
						type='text'
						id='username'
						{...register('username', { required: true })}
					/>
					{errors?.username?.type === 'required' && (
						<h5>Введите имя пользователя</h5>
					)}
				</label>
				<label htmlFor='password'>
					<h3>Введите пароль</h3>
					<input
						className={Styles['input']}
						type='password'
						id='password'
						{...register('password', { required: true })}
					/>
					{errors?.password?.type === 'required' && <h5>Введите пароль</h5>}
				</label>
				<button className={Styles['auth_button']} type='submit'>
					Авторизоваться
				</button>

				{/* {responseInfo.text && (
					<h5
						className={`${Styles['response']} ${Styles[`${responseInfo.ok ? 'response_good' : 'response_bad'}`]}`}
					>
						{responseInfo.text}
					</h5>
				)} */}
			</form>
		</div>
	);
}
