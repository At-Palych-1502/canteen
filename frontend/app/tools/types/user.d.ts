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

export interface ILoginRes {
	token: string;
	user: IUser;
}
