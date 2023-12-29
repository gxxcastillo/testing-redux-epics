import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import counterReducer from '../features/counter/counterSlice';
import * as counterEpics from '../features/counter/counterEpics';
 
const epics = combineEpics(...Object.values(counterEpics));

const epicMiddleware = createEpicMiddleware<any, any, any, any>({
  dependencies: {
    submit({ amount, newCounter }: { amount: number, newCounter: number }) {
      console.log(`Incremented by ${amount}, the new value is ${newCounter}`);
    }
  }
});

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(epicMiddleware)
  },
});

epicMiddleware.run(epics);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
