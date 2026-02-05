type UserRole = 'student' | 'cook' | 'admin';

export interface IUser {
	email: string;
	username: string;
	id: string;
	role: UserRole;
}

export interface ILoginArgs {
	username: string;
	password: string;
	rememberMe?: boolean;
}

export interface IRegisterArgs {
	username: string;
	email: string;
	password: string;
	name: string;
	surname: string;
	patronymic: string;
}

export interface ILoginRes {
	access_token: string;
	user: IUser;
}
