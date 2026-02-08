import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/auth';
import type {
	IIngredientArg,
	IIngredientRes,
	IIngredientUpdate,
} from '../../types/ingredients';

export const ingredientsApi = createApi({
	reducerPath: 'ingredientsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.ingredients.base,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		getAllIngredients: builder.query<IIngredientRes[], void>({
			query: () => '',
		}),
		getIngredientById: builder.query<IIngredientRes, number>({
			query: (id: number) => `/${id}`,
		}),
		deleteIngredient: builder.mutation<void, number>({
			query: (id: number) => ({
				url: `/${id}`,
				method: 'DELETE',
			}),
		}),
		updateIngredient: builder.mutation<void, IIngredientUpdate>({
			query: ({ id, data }) => ({
				url: `/${id}`,
				method: 'PUT',
				body: data,
			}),
		}),
		createIngredient: builder.mutation<number, IIngredientArg>({
			query: data => ({
				url: '',
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export const {
	useGetAllIngredientsQuery,
	useGetIngredientByIdQuery,
	useDeleteIngredientMutation,
	useUpdateIngredientMutation,
	useCreateIngredientMutation,
} = ingredientsApi;
