import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../tools/redux/user';
import { IUser, UserRole } from '../../../../tools/types/user';
import { getUsers, changeRole, deleteUser } from '../../../../tools/mockData';
import { UserRow } from '../UserRow/UserRow';
import { RoleChangePopup } from '../RoleChangePopup/RoleChangePopup';
import { DeleteConfirmPopup } from '../DeleteConfirmPopup/DeleteConfirmPopup';
import Styles from './UsersTable.module.css';
import FeedbackSection from '../FeedbackSection/FeedbackSection';

interface PopupState {
	type: 'role' | 'delete' | null;
	userId: number;
	username: string;
	currentRole: UserRole;
}

const USERS_PER_PAGE = 5;

const UsersTable: React.FC = () => {
	const currentUser = useSelector(selectUser);
	const [users, setUsers] = useState<IUser[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [popup, setPopup] = useState<PopupState>({
		type: null,
		userId: 0,
		username: '',
		currentRole: 'student',
	});

	useEffect(() => {
		loadUsers();
	}, []);

	// Сбрасываем страницу при изменении поискового запроса или фильтра
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, roleFilter]);

	// Проверка роли пользователя - компонент отображается только для администраторов
	if (!currentUser || currentUser.role !== 'admin') {
		return null;
	}

	const loadUsers = () => {
		const loadedUsers = getUsers();
		setUsers(loadedUsers);
		setCurrentPage(1);
	};

	// Фильтрация пользователей по поисковому запросу и типу
	const filteredUsers = users.filter(user => {
		const query = searchQuery.toLowerCase();
		const matchesSearch =
			user.username.toLowerCase().includes(query) ||
			user.email.toLowerCase().includes(query);
		const matchesRole = roleFilter === 'all' || user.role === roleFilter;
		return matchesSearch && matchesRole;
	});

	const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
	const startIndex = (currentPage - 1) * USERS_PER_PAGE;
	const endIndex = startIndex + USERS_PER_PAGE;
	const currentUsers = filteredUsers.slice(startIndex, endIndex);

	const handleOpenRolePopup = (userId: number) => {
		const user = users.find(u => u.id === userId);
		if (user) {
			setPopup({
				type: 'role',
				userId,
				username: user.username,
				currentRole: user.role,
			});
		}
	};

	const handleOpenDeletePopup = (userId: number) => {
		const user = users.find(u => u.id === userId);
		if (user) {
			setPopup({
				type: 'delete',
				userId,
				username: user.username,
				currentRole: user.role,
			});
		}
	};

	const handleClosePopup = () => {
		setPopup({ type: null, userId: 0, username: '', currentRole: 'student' });
	};

	const handleSaveRole = (userId: number, newRole: UserRole) => {
		const success = changeRole(userId, newRole);
		if (success) {
			loadUsers();
		}
	};

	const handleDeleteUser = (userId: number) => {
		const success = deleteUser(userId);
		if (success) {
			loadUsers();
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePageClick = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className={Styles.container}>
			<h1 className={Styles.title}>Управление пользователями</h1>
			<div className={Styles.contentWrapper}>
				<div className={Styles.usersSection}>
					<div className={Styles.filtersWrapper}>
						<div className={Styles.searchWrapper}>
							<input
								type='text'
								className={Styles.searchInput}
								placeholder='Поиск по имени или email'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className={Styles.roleFilterWrapper}>
							<select
								className={Styles.roleFilter}
								value={roleFilter}
								onChange={e =>
									setRoleFilter(e.target.value as UserRole | 'all')
								}
							>
								<option value='all'>Все типы</option>
								<option value='student'>Ученики</option>
								<option value='cook'>Повара</option>
								<option value='admin'>Администраторы</option>
							</select>
						</div>
					</div>

					{currentUsers.length === 0 ? (
						<div className={Styles.emptyMessage}>
							<p className={Styles.emptyText}>Пользователи не найдены</p>
						</div>
					) : (
						<>
							<div className={Styles.tableWrapper}>
								<table className={Styles.table}>
									<thead>
										<tr className={Styles.headerRow}>
											<th className={Styles.headerCell}>Имя пользователя</th>
											<th className={Styles.headerCell}>Тип</th>
											<th className={Styles.headerCell}>Email</th>
											<th className={Styles.headerCell}>Действия</th>
										</tr>
									</thead>
									<tbody>
										{currentUsers.map(user => (
											<UserRow
												key={user.id}
												user={user}
												onChangeRole={handleOpenRolePopup}
												onDelete={handleOpenDeletePopup}
											/>
										))}
									</tbody>
								</table>
							</div>

							{totalPages > 1 && (
								<div className={Styles.pagination}>
									<button
										className={`${Styles.paginationButton} ${Styles.prevButton}`}
										onClick={handlePrevPage}
										disabled={currentPage === 1}
									>
										← Назад
									</button>

									<div className={Styles.pageNumbers}>
										{Array.from({ length: totalPages }, (_, i) => i + 1).map(
											page => (
												<button
													key={page}
													className={`${Styles.pageButton} ${
														page === currentPage ? Styles.activePage : ''
													}`}
													onClick={() => handlePageClick(page)}
												>
													{page}
												</button>
											),
										)}
									</div>

									<button
										className={`${Styles.paginationButton} ${Styles.nextButton}`}
										onClick={handleNextPage}
										disabled={currentPage === totalPages}
									>
										Вперед →
									</button>
								</div>
							)}
						</>
					)}
				</div>

				<div className={Styles.feedbackSection}>
					<FeedbackSection />
				</div>
			</div>

			{popup.type === 'role' && (
				<RoleChangePopup
					userId={popup.userId}
					username={popup.username}
					currentRole={popup.currentRole}
					onClose={handleClosePopup}
					onSave={handleSaveRole}
				/>
			)}

			{popup.type === 'delete' && (
				<DeleteConfirmPopup
					userId={popup.userId}
					username={popup.username}
					onClose={handleClosePopup}
					onConfirm={handleDeleteUser}
				/>
			)}
		</div>
	);
};

export default UsersTable;
