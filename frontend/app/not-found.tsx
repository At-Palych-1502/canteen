import React from 'react';
import './globals.css';
import Link from 'next/link';

const Custom404 = () => {
	return (
		<div className='not-found'>
			<h2>Страница не найдена</h2>
			<Link href={'/'}>На главную</Link>
		</div>
	);
};

export default Custom404;
