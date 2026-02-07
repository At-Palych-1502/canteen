import { AuthInputs } from '../types/user';

export const setAccessToken = (token: string) => {
	if (typeof window === 'undefined') return;
	localStorage.setItem('accessToken', token);
};

export const getAccessToken = (): string => {
	if (typeof window === 'undefined') return '';
	return localStorage.getItem('accessToken') || '';
};

export const removeAccessToken = () => {
	if (typeof window === 'undefined') return;
	localStorage.removeItem('accessToken');
};

type LoginError = {
	status: number | string;
	data: {
		error: string;
	};
};

export const getAuthErrorMessage = (error: LoginError): string => {
	if (!error) return 'Неизвестная ошибка';

	if (error.status === 'FETCH_ERROR')
		return 'Не удалось подключиться к серверу';
	if (error.data.error === 'Invalid credentials')
		return 'Неверный логин или пароль';
	if (error.data.error === 'Username already exists')
		return 'Данное имя пользователя уже занято';

	return 'Неизвестная ошибка';
};

export const getAuthData = () => {
	if (typeof window === 'undefined') return;

	return JSON.parse(localStorage.getItem('authData') || '{}');
};

export const setAuthData = (data: AuthInputs) => {
	if (typeof window === 'undefined') return;

	return localStorage.setItem('authData', JSON.stringify(data));
};
