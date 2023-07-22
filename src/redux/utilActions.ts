import { createAction } from "@reduxjs/toolkit"

export const resetState = createAction('resetState');
export const clearState = createAction('clearState');
export const gameOver = createAction('gameOver');