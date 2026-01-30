import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
	IAddIngredientArg,
	IDishArg,
	IDishRes,
	IDishUpdate,
} from '../../types/dishes';
import { getAccessToken } from '../../utils/auth';

export const dishesApi = createApi({
	reducerPath: 'dishesApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.dishes.base,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		getAllDishes: builder.query<IDishRes[], void>({
			query: () => '',
		}),
		getDishById: builder.query<IDishRes, number>({
			query: (id: number) => `/${id}`,
		}),
		deleteDish: builder.mutation<void, number>({
			query: (id: number) => ({
				url: `/${id}`,
				method: 'DELETE',
			}),
		}),
		updateDish: builder.mutation<void, IDishUpdate>({
			query: ({ id, data }: IDishUpdate) => ({
				url: `/${id}`,
				method: 'PUT',
				body: data,
			}),
		}),
		createDish: builder.mutation<number, IDishArg>({
			query: (data: IDishArg) => ({
				url: '',
				method: 'POST',
				body: data,
			}),
		}),
		addIngredient: builder.mutation<void, IAddIngredientArg>({
			query: ({ dishId, ingredientId }: IAddIngredientArg) => ({
				url: `${dishId}/add-ingredient/${ingredientId}`,
				method: 'POST',
				body: {},
			}),
		}),
	}),
});

export const {
	useGetAllDishesQuery,
	useGetDishByIdQuery,
	useDeleteDishMutation,
	useUpdateDishMutation,
	useCreateDishMutation,
	useAddIngredientMutation,
} = dishesApi;
