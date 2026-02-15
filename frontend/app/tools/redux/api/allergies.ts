import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/auth';

export const allergiesApi = createApi({
	reducerPath: 'allergiesApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.allergies.addAllergy,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
        addAllergy: builder.query<void, number>({
            query: (id: number) => `/${id}`,
        })
	}),
});

export const {
    useAddAllergyQuery
} = allergiesApi;
