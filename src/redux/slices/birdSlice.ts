import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { resetState } from '../utilActions';

export interface BirdState {
    x: number;
    y: number;
    r: number;
    width: number;
    height: number;
}

const initState: BirdState = {
    x: 120,
    y: Math.ceil(window.innerHeight * 0.8 / 3),
    r: 0,
    width: 38,
    height: 26,
}

const birdSlice = createSlice({
    name: 'bird',
    initialState: initState,
    reducers: {
        fly: (state, action: PayloadAction<number>) => {
            // state.y -= 40;//50
            state.y -= action.payload;//50
            state.r = -16;

            return state;
        },
        fall: (state, action: PayloadAction<number>) => {
            state.y += action.payload;//20
            let newRotate = state.r + 0.2;
            if (newRotate < 0) {
                state.r = newRotate;
            }
            else {
                state.r = 0;
            }

            return state;
        },
        setBirdY: (state, action: PayloadAction<number>) => {
            state.y = action.payload;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetState, (state) => {
                state = initState;
                return state;
            })
    },
})

export const selectBird = (state: RootState) => state.bird;

export const { fly, fall, setBirdY } = birdSlice.actions;
export default birdSlice.reducer;