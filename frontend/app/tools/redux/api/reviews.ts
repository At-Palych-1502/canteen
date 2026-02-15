import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/auth';
import {
	IAddReview,
	IGetReviewRes,
	IGetReviewsByMealIdRes,
	IReview,
	IUpdateReviewReq,
	IUpdateReviewRes,
} from '../../types/reviews';

export const reviewsApi = createApi({
	reducerPath: 'reviewsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.base,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		addReview: builder.mutation<IReview, IAddReview>({
			query: ({ dishId, comment, score }: IAddReview) => ({
				url: `/reviews/${dishId}`,
				body: { comment, score },
				method: "POST"
			}),
		}),
		getReviewById: builder.query<IReview, number>({
			query: (id: number) => `/review/${id}`,
		}),
		getReviewsByMealId: builder.query<IGetReviewsByMealIdRes, number>({
			query: (id: number) => `/reviews/${id}`,
		}),
		deleteReview: builder.mutation<void, number>({
			query: (id: number) => ({
				url: `/review/${id}`,		
				method: 'DELETE',
			}),
		}),
		updateReview: builder.mutation<IUpdateReviewRes, IUpdateReviewReq>({
			query: ({ id, data }) => ({
				url: `/review${id}`,
				method: 'PUT',
				body: data,
			}),
		}),
		getReviewsByUser: builder.query<IGetReviewRes, void>({
			query: () => ({
				url: '/reviews_by_user'
			})
		})
	}),
});

export const {
	useAddReviewMutation,
	useDeleteReviewMutation,
	useGetReviewByIdQuery,
	useGetReviewsByMealIdQuery,
	useGetReviewsByUserQuery,
	useUpdateReviewMutation
} = reviewsApi;
