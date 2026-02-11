import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/auth';
import { IMeal } from '../../types/meals';

export const businessApi = createApi({
	reducerPath: 'businessApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.base,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		getMenu: builder.query<IMeal[], number>({
			query: (dayOfWeek: number) => `/menu?${dayOfWeek}`,
		}),
		deleteMeal: builder.mutation<void, number>({
			query: (id: number) => ({
				url: `/${id}`,
				method: 'DELETE',
			}),
		}),
	}),
});

export const { useGetMenuQuery } = businessApi;
