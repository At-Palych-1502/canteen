'use client';

import Styles from './AuthFrom.module.css';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/app/tools/redux/api/auth';
import { getLoginErrorMessage } from '@/app/tools/utils/auth';
import { selectUser, setUser } from '@/app/tools/redux/user';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
	closePopup: VoidFunction;
}

interface Inputs {
	username: string;
	password: string;
}

export function AuthForm({ closePopup }: Props) {
	const User = useSelector(selectUser);
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<Inputs>();

	const [login, { error: loginError }]: ReturnType<typeof useLoginMutation> =
		useLoginMutation();

	const loginHandler = async (inputs: Inputs) => {
		const { data, error } = await login(inputs);

		if (error) return;

		console.log(data);

		dispatch(setUser(data.user));

		closePopup();

		return;
	};

	console.log(User);

	return (
		<div>
			<h1 className={Styles['title']}>Авторизация</h1>
			<form className={Styles['form']} onSubmit={handleSubmit(loginHandler)}>
				<label htmlFor='username'>
					<h3>Введите имя пользователя</h3>
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
				<button
					className={`${Styles['auth_button']} ${isSubmitting ? Styles['auth_button_disabled'] : ''}`}
					type='submit'
				>
					Авторизоваться
				</button>

				{loginError && (
					<h5 className={`${Styles['response']} ${Styles[`response_bad`]}`}>
						{getLoginErrorMessage(loginError)}
					</h5>
				)}
			</form>
		</div>
	);
}
