import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IDish } from '../types/dishes';

export const dishesApi = createApi({
	reducerPath: 'dishesApi',
	baseQuery: fetchBaseQuery({ baseUrl: endpoints.dishes.base }),
	endpoints: builder => ({
		getDishes: builder.query<IDish[], void>({
			query: () => '/',
		}),
		getDishById: builder.query<IDish, number>({
			query: (id: number) => `/${id}`,
		}),
	}),
});

export const { useGetDishesQuery, useGetDishByIdQuery } = dishesApi;
