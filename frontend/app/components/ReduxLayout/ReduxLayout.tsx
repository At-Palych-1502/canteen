'use client';

import { store } from '@/app/tools/redux/store';
import React from 'react';
import { Provider } from 'react-redux';
import { Header } from '../Header/Header';

interface IProps {
	children: React.ReactNode;
}

const ReduxLayout = ({ children }: IProps) => {
	return (
		<Provider store={store}>
			<Header />
			{children}
		</Provider>
	);
};

export default ReduxLayout;
