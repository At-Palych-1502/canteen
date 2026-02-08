import { useProtectedPage } from '@/app/tools/hooks/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface IProps {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: IProps) => {
	const router = useRouter();
	const status = useProtectedPage();

	useEffect(() => {
		if (status === false) router.back();
	}, [status, router]);

	if (status === true) return <>{children}</>;
	else return null;
};

export default AuthLayout;
