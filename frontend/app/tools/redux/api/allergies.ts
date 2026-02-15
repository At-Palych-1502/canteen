import { endpoints } from '@/app/config/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/auth';

export const allergiesApi = createApi({
	reducerPath: 'allergiesApi',
	baseQuery: fetchBaseQuery({
		baseUrl: endpoints.base,
		prepareHeaders: headers => {
			const token = getAccessToken();

			if (token) headers.set('authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
        getAllergies: builder.query<IGetAllergyRes, void>({
            query: () => '/allergies'
        }),
        addAllergy: builder.mutation<void, number>({
            query: (id: number) => ({
                url: `/add_allergic_ingredient/${id}`,
                method: "POST"
            })
        }),
        deleteAllergy: builder.mutation<void, number>({
            query: (id: number) => ({
                url: `/add_allergic_ingredient/${id}`,
                method: "DELETE"
            })
        })
	}),
});

export const {
    useGetAllergiesQuery,
    useAddAllergyMutation,
    useDeleteAllergyMutation
} = allergiesApi;
