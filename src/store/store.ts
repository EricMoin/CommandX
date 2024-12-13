import {
  Action,
  combineReducers,
  configureStore,
  createAsyncThunk,
  ThunkAction
} from '@reduxjs/toolkit';
import reducer from './slices/slice.ts'
import { useDispatch, useSelector } from 'react-redux';
export const store = configureStore({
  reducer: combineReducers({ reducer }),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
export type AppThunk = ThunkAction<void, RootState, unknown, Action>
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
}>()

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()