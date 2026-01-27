import { configureStore } from '@reduxjs/toolkit';
import { dishesApi } from './dishes';
import { authApi } from './auth';

export const store = configureStore({
	reducer: {
		[dishesApi.reducerPath]: dishesApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
	},

	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(dishesApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
