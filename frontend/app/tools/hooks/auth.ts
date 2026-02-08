import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/user';
import { routes } from '@/app/config/routes';

const getRole = (route: string) =>
	(routes.filter(r => r.path === route)[0] || { role: 'all' }).role;

export const useProtectedPage = () => {
	const pathname = usePathname();

	const User = useSelector(selectUser);
	const pageRole = getRole(pathname);

	if (User && User.role !== pageRole && pageRole !== 'all') {
		return false;
	}

	return true;
};
