import { createSlice } from '@reduxjs/toolkit';

export const loadersSlice = createSlice({
    name: 'loaders',
    initialState: {
        loading: false,
    },
    reducers: {
        setLoader: (state, action) => {
            state.loading = action.payload;
        },
    }
});

export const {setLoader} = loadersSlice.actions;

export default loadersSlice.reducer;
