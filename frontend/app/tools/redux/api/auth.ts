import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoints } from '@/app/config/endpoints';
import type {
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
		// такого эндпоинта пока нету
		// logout: build.mutation<ILogoutRes, void>({
		// 	query: () => ({
		// 		url: '/logout',
		// 		method: 'POST',
		// 	}),
		// 	onQueryStarted: async (_, { queryFulfilled }) => {
		// 		try {
		// 			await queryFulfilled;
		// 		} catch (error) {
		// 			console.warn(error);
		// 		} finally {
		// 			removeAccessToken();
		// 		}
		// 	},
		// }),
		getUser: build.query<{ user: IUser }, void>({
			query: () => ({
				url: endpoints.auth.user,
			}),
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation, useGetUserQuery } =
	authApi;
