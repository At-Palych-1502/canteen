import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoints } from '@/app/config/endpoints';
import type { ILoginArgs, ILoginRes, IUser } from '../types/user';
import { getAccessToken, setAccessToken } from '@/app/utils/auth';

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({ baseUrl: endpoints.base }),
	endpoints: build => ({
		login: build.mutation<ILoginRes, ILoginArgs>({
			query: (data: ILoginArgs) => ({
				url: '/login',
				// как по мне было бы удобнее
				// endpoints.auth = {base: ..., login: '/login', register: '/register'}
				// url: endpoints.auth.login,
				method: 'POST',
				body: data,
			}),
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					const { data } = await queryFulfilled;

					setAccessToken(data.token);
				} catch (error) {
					console.warn(error);
				}
			},
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
		getUser: build.query<IUser, void>({
			query: () => ({
				url: '/user',

				headers: getAccessToken()
					? {
							Authorization: `Bearer ${getAccessToken()}`,
						}
					: {},
			}),
		}),
	}),
});

export const { useLoginMutation, useGetUserQuery } = authApi;
