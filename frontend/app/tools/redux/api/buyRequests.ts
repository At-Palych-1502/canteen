import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/auth';
import {
	ICreateBuyRequestArg,
	ICreateBuyRequestRes,
	IGetAllBuyRequestRes,
	IUpdateBuyRequest,
} from '../../types/buyRequests';

export const buyRequestsApi = createApi({
	reducerPath: 'buyRequestsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.buyRequests.base,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		getAllBuyRequests: builder.query<IGetAllBuyRequestRes, void>({
			query: () => '',
		}),
		updateBuyRequest: builder.mutation<void, IUpdateBuyRequest>({
			query: ({ id, data }: IUpdateBuyRequest) => ({
				url: `/${id}`,
				method: 'PUT',
				body: data,
			}),
		}),
		createBuyRequest: builder.mutation<
			ICreateBuyRequestRes,
			ICreateBuyRequestArg
		>({
			query: (data: ICreateBuyRequestArg) => ({
				url: '',
				method: 'POST',
				body: data,
			}),
		}),
		acceptBuyRequest: builder.mutation<void, number>({
			query: (reqId: number) => ({
				url: `${reqId}/accept`,
				method: 'PUT',
				body: {},
			}),
		}),
		rejectBuyRequest: builder.mutation<void, number>({
			query: (reqId: number) => ({
				url: `${reqId}/reject`,
				method: 'PUT',
				body: {},
			}),
		}),
	}),
});

export const {
	useGetAllBuyRequestsQuery,
	useCreateBuyRequestMutation,
	useUpdateBuyRequestMutation,
	useAcceptBuyRequestMutation,
	useRejectBuyRequestMutation,
} = buyRequestsApi;
