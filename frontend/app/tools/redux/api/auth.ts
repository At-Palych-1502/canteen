import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoints } from '@/app/config/endpoints';
import type {
	IBalanceRes,
	IChangeRole,
	IFilterUsersReq,
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
		login: build.mutation<ILoginRes, any>({
			query: (data: any) => ({
				url: endpoints.auth.login,
				method: 'POST',
				body: { ...data, remember_me: true},
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
		addAllergicIngredient: build.mutation<void, number>({
			query: (ingredientId: number) => ({
				url: `/add_allergic_ingredient/${ingredientId}`,
			}),
		}),
		topupBalance: build.mutation<IBalanceRes, void>({
			query: () => ({
				url: `/balance/topup`,
				method: 'PUT',
			}),
		}),
		deductBalance: build.mutation<IBalanceRes, void>({
			query: () => ({
				url: `/balance/deduct`,
				method: 'PUT',
			}),
		}),
		filterUsers: build.query<{ users: IUser[] }, IFilterUsersReq>({
			query: (filters: IFilterUsersReq) => ({
				url: `/users/filter?${Object.keys(filters)
					.map((key, index) => `${key}=${Object.values(filters)[index]}`)
					.join('&')}`,
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
	useAddAllergicIngredientMutation,
	useDeductBalanceMutation,
	useTopupBalanceMutation,
} = authApi;
