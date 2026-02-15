import { configureStore } from '@reduxjs/toolkit';
import { dishesApi } from './api/dishes';
import { authApi } from './api/auth';
import { ingredientsApi } from './api/ingredients';
import { userSlice } from './user';
import { mealsApi } from './api/meals';
import { buyRequestsApi } from './api/buyRequests';
import { reviewsApi } from './api/reviews';
import { allergiesApi } from './api/allergies';

export const store = configureStore({
	reducer: {
		[dishesApi.reducerPath]: dishesApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[ingredientsApi.reducerPath]: ingredientsApi.reducer,
		[mealsApi.reducerPath]: mealsApi.reducer,
		[buyRequestsApi.reducerPath]: buyRequestsApi.reducer,
		[reviewsApi.reducerPath]: reviewsApi.reducer,
		[userSlice.name]: userSlice.reducer,
		[allergiesApi.reducerPath]: allergiesApi.reducer
	},

	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(
			dishesApi.middleware,
			authApi.middleware,
			ingredientsApi.middleware,
			mealsApi.middleware,
			buyRequestsApi.middleware,
			reviewsApi.middleware,
			allergiesApi.middleware
		),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
