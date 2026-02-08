'use client';

import { store } from '@/app/tools/redux/store';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Header } from '../Header/Header';
import AuthLayout from '../AuthLayout/AuthLayout';

interface IProps {
	children: React.ReactNode;
}

const ReduxLayout = ({ children }: IProps) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) {
		return <h1 className='page-loading'>Загрузка...</h1>;
	}

	return (
		<Provider store={store}>
			<AuthLayout>
				<Header />
				{children}
			</AuthLayout>
		</Provider>
	);
};

export default ReduxLayout;
