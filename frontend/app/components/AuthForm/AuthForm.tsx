'use client';

import Styles from './AuthForm.module.css';
import { useForm } from 'react-hook-form';
import {
	useLoginMutation,
	useRegisterMutation,
} from '@/app/tools/redux/api/auth';
import {
	getAuthData,
	getAuthErrorMessage,
	setAuthData,
} from '@/app/tools/utils/auth';
import { setUser } from '@/app/tools/redux/user';
import { useDispatch } from 'react-redux';
import { AuthInputs } from '@/app/tools/types/user';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
	closePopup: VoidFunction;
	isLogin: boolean;
	openLoginPopup: VoidFunction;
}

export function AuthForm({ closePopup, isLogin, openLoginPopup }: Props) {
	const dispatch = useDispatch();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<AuthInputs>({ defaultValues: getAuthData() });

	const values = watch();

	useEffect(() => setAuthData({ ...values, password: '' }), [values]);

	const [login, { error: loginError }]: ReturnType<typeof useLoginMutation> =
		useLoginMutation();
	const [Register, { error: registerError }]: ReturnType<
		typeof useRegisterMutation
	> = useRegisterMutation();

	const loginHandler = async (inputs: AuthInputs) => {
		const { data, error } = await login(inputs);

		if (error) return;

		dispatch(setUser(data.user));

		closePopup();

		router.refresh();

		return;
	};

	const registerHandler = async (inputs: AuthInputs) => {
		const { error } = await Register(inputs);

		if (error) return;

		closePopup();
		openLoginPopup();

		return;
	};

	return (
		<div>
			<h1 className={Styles['title']}>Авторизация</h1>
			{isLogin ? (
				<form className={Styles['form']} onSubmit={handleSubmit(loginHandler)}>
					<label htmlFor='username'>
						<h3>Имя пользователя</h3>
						<input
							className={Styles['input']}
							type='text'
							id='username'
							{...register('username', { required: true })}
						/>
						{errors?.username?.type === 'required' && (
							<h5 className={`${Styles['response_bad']}`}>
								Введите имя пользователя
							</h5>
						)}
					</label>
					<label htmlFor='password'>
						<h3>Пароль</h3>
						<input
							className={Styles['input']}
							type='password'
							id='password'
							{...register('password', { required: true })}
						/>
						{errors?.password?.type === 'required' && (
							<h5 className={`${Styles['response_bad']}`}>Введите пароль</h5>
						)}
					</label>
					<button
						className={`${Styles['auth_button']} ${isSubmitting ? Styles['auth_button_disabled'] : ''}`}
						type='submit'
					>
						Авторизоваться
					</button>

					{loginError && (
						<h5 className={`${Styles['response']} ${Styles[`response_bad`]}`}>
							{getAuthErrorMessage(loginError)}
						</h5>
					)}
				</form>
			) : (
				<form
					className={Styles['form']}
					onSubmit={handleSubmit(registerHandler)}
				>
					<label htmlFor='email'>
						<h3>Почта</h3>
						<input
							className={Styles['input']}
							type='email'
							id='email'
							{...register('email', { required: true })}
						/>
						{errors?.email?.type === 'required' && (
							<h5 className={`${Styles['response_bad']}`}>Введите почту</h5>
						)}
					</label>
					<label htmlFor='username'>
						<h3>Имя пользователя</h3>
						<input
							className={Styles['input']}
							type='text'
							id='username'
							{...register('username', { required: true })}
						/>
						{errors?.username?.type === 'required' && (
							<h5 className={`${Styles['response_bad']}`}>
								Введите имя пользователя
							</h5>
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
						{errors?.password?.type === 'required' && (
							<h5 className={`${Styles['response_bad']}`}>Введите пароль</h5>
						)}
					</label>
					<label htmlFor='name'>
						<h3>Имя</h3>
						<input
							className={Styles['input']}
							type='text'
							id='name'
							{...register('name', { required: true })}
						/>
						{errors?.name?.type === 'required' && (
							<h5 className={`${Styles['response_bad']}`}>Введите ваше имя</h5>
						)}
					</label>
					<label htmlFor='surname'>
						<h3>Фамилия</h3>
						<input
							className={Styles['input']}
							type='text'
							id='surname'
							{...register('surname', { required: true })}
						/>
						{errors?.surname?.type === 'required' && (
							<h5 className={`${Styles['response_bad']}`}>
								Введите вашу фамилию
							</h5>
						)}
					</label>
					<label htmlFor='patronymic'>
						<h3>Отчество</h3>
						<input
							className={Styles['input']}
							type='text'
							id='patronymic'
							{...register('patronymic', { required: true })}
						/>
						{errors?.patronymic?.type === 'required' && (
							<h5 className={`${Styles['response_bad']}`}>
								Введите ваше отчество
							</h5>
						)}
					</label>
					<button
						className={`${Styles['auth_button']} ${isSubmitting ? Styles['auth_button_disabled'] : ''}`}
						type='submit'
					>
						Зарегистрироваться
					</button>

					{registerError && (
						<h5 className={`${Styles['response']} ${Styles[`response_bad`]}`}>
							{getAuthErrorMessage(registerError)}
						</h5>
					)}
				</form>
			)}
		</div>
	);
}
