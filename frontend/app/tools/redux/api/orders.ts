import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/auth';

import {
	ICreateReportArg,
	IGetAllOrders,
	IGetOrderById,
	IOrderCreateArg,
} from '../../types/business';

export const ordersApi = createApi({
	reducerPath: 'ordersApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.base,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		createOrder: builder.mutation<void, IOrderCreateArg>({
			query: data => ({
				url: '/order',
				method: 'POST',
				body: data,
			}),
		}),
		getOrderById: builder.query<IGetOrderById, number>({
			query: (id: number) => `/orders/${id}`,
		}),
		getAllOrders: builder.query<IGetAllOrders, void>({
			query: () => `/orders`,
		}),
		GetReport: builder.query<void, ICreateReportArg>({
			query: (data: ICreateReportArg) => ({
				url: `/report?days=${data.days}`,
				method: 'GET',
				responseHandler: response => response.blob(),
			}),
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useGetOrderByIdQuery,
	useGetReportQuery,
} = ordersApi;
