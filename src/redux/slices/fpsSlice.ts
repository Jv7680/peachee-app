import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface fpsState {
    fps: number;
}

const initState: number = +(localStorage.getItem("deviceStableFPS") || "60");

const fpsSlice = createSlice({
    name: 'fps',
    initialState: initState,
    reducers: {
        setFPS: (state, action: PayloadAction<number>) => {
            state = action.payload;
            return state;
        },
    },
})

// pass this fn to useAppSelector to get the bird redux state
export const selectFPS = (state: RootState) => state.fps;

export const { setFPS } = fpsSlice.actions;
export default fpsSlice.reducer;