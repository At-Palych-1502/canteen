import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../types/user';
import { RootState } from './store';

export type UserState = IUser | { user: null };

const initialState: UserState = { user: null };

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
