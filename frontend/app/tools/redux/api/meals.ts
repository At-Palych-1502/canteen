import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/auth';
import {
	IMeal,
	IMealCreateArg,
	IMealsGet,
	IMealUpdateReq,
} from '../../types/meals';

export const mealsApi = createApi({
	reducerPath: 'mealsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.base,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		getAllMeals: builder.query<IMealsGet, void>({
			query: () => '/meals',
		}),
		getMealById: builder.query<IMeal, number>({
			query: (id: number) => `/meals/${id}`,
		}),
		deleteMeal: builder.mutation<void, number>({
			query: (id: number) => ({
				url: `/meals/${id}`,
				method: 'DELETE',
			}),
		}),
		updateMeal: builder.mutation<IMeal, IMealUpdateReq>({
			query: ({ id, data }) => ({
				url: `/meals/${id}`,
				method: 'PUT',
				body: data,
			}),
		}),
		createMeal: builder.mutation<number, IMealCreateArg>({
			query: data => ({
				url: '/meals',
				method: 'POST',
				body: data,
			}),
		}),
		setMealsCount: builder.mutation<number, { id: number; quantity: number }[]>(
			{
				query: data => ({
					url: '/set_meals_count',
					method: 'PUT',
					body: data,
				}),
			},
		),
	}),
});

export const {
	useGetAllMealsQuery,
	useGetMealByIdQuery,
	useDeleteMealMutation,
	useUpdateMealMutation,
	useCreateMealMutation,
} = mealsApi;
