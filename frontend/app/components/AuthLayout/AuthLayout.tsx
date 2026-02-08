import Custom404 from '@/app/not-found';
import { useProtectedPage } from '@/app/tools/hooks/auth';
import React from 'react';

interface IProps {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: IProps) => {
	const status = useProtectedPage();

	if (status === true) return <>{children}</>;
	else return <Custom404 />;
};

export default AuthLayout;
