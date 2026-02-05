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

export const getLoginErrorMessage = (error: LoginError): string => {
	if (!error) return 'Неизвестная ошибка';

	if (error.status === 'FETCH_ERROR')
		return 'Не удалось подключиться к серверу';
	if (error.data.error === 'Invalid credentials')
		return 'Неверный логин или пароль';

	return 'Неизвестная ошибка';
};
