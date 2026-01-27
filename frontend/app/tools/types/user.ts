type UserRole = 'student' | 'cook' | 'admin';

export interface User {
	id: string;
	email: string;
	role: UserRole;
	username: string;
}
