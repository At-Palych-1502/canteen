import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../types/user.d';
import { RootState } from './store';
import { getUserLocalStorage, setUserLocalStorage } from '../utils/auth';

export type UserState = { user: IUser | null; orderCount: number };

const initialState: UserState = { user: getUserLocalStorage(), orderCount: 0 };

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;

			if (action.payload) {
				setUserLocalStorage(action.payload);
			}
		},
		SetOrderCount: (state, action) => {
			state.orderCount = action.payload;
		},
	},
});

export const { setUser, SetOrderCount } = userSlice.actions;
export const selectUser = (state: RootState): IUser | null => state.user.user;
export const selectOrderCount = (state: RootState): number =>
	state.user.orderCount;

export default userSlice.reducer;
