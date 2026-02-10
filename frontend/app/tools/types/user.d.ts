type UserRole = 'student' | 'cook' | 'admin';

export interface IUser {
	email: string;
	username: string;
	id: number;
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

export interface AuthInputs {
	email: string;
	username: string;
	password: string;
	name: string;
	surname: string;
	patronymic: string;
}

export type UserRole = 'user' | 'admin' | 'cook';

export interface IChangeRole {
	id: number;
	role: UserRole;
}

export interface IBalanceRes {
	user_id: number;
	new_balance: number;
}

export interface IFilterUsersReq {
	per_page?: number;
	page?: number;
	username?: string;
	email?: string;
	role?: string;
}
