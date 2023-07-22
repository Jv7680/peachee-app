import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { resetState } from '../utilActions';

export interface ScoreState {
    score: number;
}

const initState: number = 0;

const scoreSlice = createSlice({
    name: 'score',
    initialState: initState,
    reducers: {
        plusScore: (state) => {
            state++;
            return state;
        },
        setScore: (state, action: PayloadAction<number>) => {
            state = action.payload;
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

// pass this fn to useAppSelector to get the bird redux state
export const selectScore = (state: RootState) => state.score;

export const { plusScore, setScore } = scoreSlice.actions;
export default scoreSlice.reducer;