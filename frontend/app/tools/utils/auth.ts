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
