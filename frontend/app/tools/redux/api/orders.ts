import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/auth';
import {
	IMeal,
	IMealCreateArg,
	IMealsGet,
	IMealUpdateReq,
} from '../../types/meals';

export const ordersApi = createApi({
	reducerPath: 'ordersApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.meals.base,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		getAllMeals: builder.query<IMealsGet, void>({
			query: () => '',
		}),
		getMealById: builder.query<IMeal, number>({
			query: (id: number) => `/${id}`,
		}),
		deleteMeal: builder.mutation<void, number>({
			query: (id: number) => ({
				url: `/${id}`,
				method: 'DELETE',
			}),
		}),
		updateMeal: builder.mutation<IMeal, IMealUpdateReq>({
			query: ({ id, data }) => ({
				url: `/${id}`,
				method: 'PUT',
				body: data,
			}),
		}),
		createMeal: builder.mutation<number, IMealCreateArg>({
			query: data => ({
				url: '',
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export const {
	useGetAllMealsQuery,
	useGetMealByIdQuery,
	useDeleteMealMutation,
	useUpdateMealMutation,
	useCreateMealMutation,
} = ordersApi;
