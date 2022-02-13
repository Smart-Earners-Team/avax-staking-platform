import { createAction } from '@reduxjs/toolkit';

export const updateGasPrice = createAction<{ gasPrice: string }>('user/updateGasPrice');
