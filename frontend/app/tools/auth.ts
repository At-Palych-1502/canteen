import { endpoints } from '../config/endpoints';
import { User } from './types/user';
import { setJWT } from './jwt';

interface AuthInfo {
	username: string;
	password: string;
}

export async function loginUser(authInfo: AuthInfo) {
	try {
		const response = await fetch(endpoints.auth.login, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(authInfo),
		});

		if (response.ok) {
			const json = await response.json();
			const user: User = json.user;

			setJWT(json.access_token);

			return { ok: true, user };
		}

		return { ok: false, error: `${response.status}: ${response.statusText}` };
	} catch (error) {
		return { ok: false, error: `Неизвестная ошибка` };
	}
}
