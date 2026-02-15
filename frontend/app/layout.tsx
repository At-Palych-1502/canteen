import type { Metadata } from 'next';
import './globals.css';
import ReduxLayout from './components/ReduxLayout/ReduxLayout';

export const metadata: Metadata = {
	title: 'Умная столовая',
	description: 'Веб-платформа для помощи ученикам и поварам',
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en'>
			<body>
				<ReduxLayout>
					<main className='main-container'>{children}</main>
				</ReduxLayout>
			</body>
		</html>
	);
}
