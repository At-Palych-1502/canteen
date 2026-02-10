import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoints } from '@/app/config/endpoints';
import type {
	IChangeRole,
	ILoginArgs,
	ILoginRes,
	IRegisterArgs,
	IUser,
} from '../../types/user.d';
import { getAccessToken, setAccessToken } from '@/app/tools/utils/auth';

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.base,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: build => ({
		login: build.mutation<ILoginRes, ILoginArgs>({
			query: (data: ILoginArgs) => ({
				url: endpoints.auth.login,
				method: 'POST',
				body: data,
			}),
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					const { data } = await queryFulfilled;

					setAccessToken(data.access_token);
				} catch (error) {
					console.warn(error);
				}
			},
		}),
		register: build.mutation<void, IRegisterArgs>({
			query: (data: IRegisterArgs) => ({
				url: endpoints.auth.register,
				method: 'POST',
				body: data,
			}),
		}),
		deleteUser: build.mutation<void, number>({
			query: (id: number) => ({
				url: endpoints.users.delete + `/${id}`,
				method: 'DELETE',
			}),
		}),
		getAllUsers: build.query<{ data: IUser[] }, void>({
			query: () => ({
				url: endpoints.users.getAll,
			}),
		}),
		getUserById: build.query<IUser, number>({
			query: (id: number) => ({
				url: endpoints.users.getUser + `/${id}`,
			}),
		}),
		changeRole: build.mutation<IUser, IChangeRole>({
			query: ({ id, role }: IChangeRole) => ({
				url: endpoints.users.changeRole + `/${id}`,
				body: { role },
				method: 'PUT',
			}),
		}),
		getUser: build.query<{ user: IUser }, void>({
			query: () => ({
				url: endpoints.auth.user,
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useGetUserQuery,
	useGetAllUsersQuery,
	useChangeRoleMutation,
	useGetUserByIdQuery,
	useDeleteUserMutation,
} = authApi;
