import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initState: boolean = false;

const isLoadingSlice = createSlice({
    name: 'isLoading',
    initialState: initState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state = action.payload;
            return state;
        },
    },
})

export const { setIsLoading } = isLoadingSlice.actions;
export default isLoadingSlice.reducer;