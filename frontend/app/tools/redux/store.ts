import { configureStore } from '@reduxjs/toolkit';
import { dishesApi } from './api/dishes';
import { authApi } from './api/auth';
import { ingredientsApi } from './api/ingredients';
import { userSlice } from './user';

export const store = configureStore({
	reducer: {
		[dishesApi.reducerPath]: dishesApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[ingredientsApi.reducerPath]: ingredientsApi.reducer,
		[userSlice.name]: userSlice.reducer,
	},

	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(
			dishesApi.middleware,
			authApi.middleware,
			ingredientsApi.middleware,
		),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
