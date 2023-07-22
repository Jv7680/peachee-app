import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { resetState } from '../utilActions';

export interface PipesElement {
    x: number;
    topPipeHeight: number;
}

export interface PipeState {
    generateFirstPipeAtX: number;
    gap: number;
    width: number;
    pipes: PipesElement[];
}

const distanceXBetweenTwoPipes: number = 400;

const innerWidth: number = window.innerWidth;
const initState: PipeState = {
    generateFirstPipeAtX: Math.ceil(innerWidth / 10) * 10 + 100,
    gap: 130,
    width: 50,
    pipes: [],
}

const pipeSlice = createSlice({
    name: 'pipe',
    initialState: initState,
    reducers: {
        generate: (state) => {
            let topPipeHeight = Math.random() / 1.25 * Math.ceil(window.innerHeight * 0.8 / 2) + 40;

            if (window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 400) {
                topPipeHeight = Math.random() * 30 + 40;
            }

            const newPipe: PipesElement = {
                x: state.generateFirstPipeAtX + state.pipes.length * distanceXBetweenTwoPipes,
                topPipeHeight,
            }
            state.pipes.push(newPipe);
            return state;
        },
        setGenerateFirstPipeAtX: (state, action: PayloadAction<number>) => {
            state.generateFirstPipeAtX = action.payload;
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
export const selectPipe = (state: RootState) => state.pipe;

export const { generate, setGenerateFirstPipeAtX } = pipeSlice.actions;
export default pipeSlice.reducer;