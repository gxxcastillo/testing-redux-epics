
import { type UnknownAction } from '@reduxjs/toolkit';
import { type Epic } from 'redux-observable';
import { filter, tap, ignoreElements } from 'rxjs';


import { RootState } from '../../app/store'
import { incrementByAmount } from './counterSlice';

export type Submitter = ({ amount, newCounter }: { amount: number, newCounter: number }) => void;
export type Dependencies = { submit: Submitter }

type CounterEpic = Epic<UnknownAction, UnknownAction, RootState, Dependencies>;

export const processIncrementByAmount: CounterEpic = (
  action$,
  state$,
  { submit }
) =>
  action$.pipe(
    filter(incrementByAmount.match),
    tap(action => {
      if (state$.value.counter.value > 5) {
        submit({
          amount: action.payload.amount,
          newCounter: state$.value.counter.value
        });
      }
    }),
    ignoreElements(),
  );