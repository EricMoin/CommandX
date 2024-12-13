import { createSlice } from '@reduxjs/toolkit';

export type InitialState = {
  token?: string
};
const state: InitialState = {

};
const dataSlice = createSlice({
  name: 'data',
  initialState: state,
  reducers: {
    setToken: (state,action) => {
      state.token = action.payload;
    }
  },
});
const { setToken } = dataSlice.actions;
export { setToken };
export default dataSlice.reducer;