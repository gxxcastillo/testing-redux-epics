import { StateObservable } from 'redux-observable';
import { scan } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { mock } from 'jest-mock-extended';

import { incrementByAmount, counterReducer, CounterState, IncrementByAmountPayload } from './counterSlice';
import { processIncrementByAmount, type Submitter } from './counterEpics';

describe('Counter Epic', () => {
  let submit: Submitter;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    submit = jest.fn();
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  
  describe('processIncrementByAmount', () => {
    it('logs each time we increment by an amount if the new amount > 5', () => {
      testScheduler.run(({ expectObservable, hot, flush }) => {
        const counterState: CounterState = {
          value: 0,
          status: 'idle'
        }

        const initialState = { counter: counterState };
        const incrementBy2 = incrementByAmount({ amount: 2 })
        const incrementBy3 = incrementByAmount({ amount: 3 })
        const incrementBy4 = incrementByAmount({ amount: 4 })
        const incrementBy5 = incrementByAmount({ amount: 5 })

        const actions$ = hot('-a-b-c-d', { a: incrementBy2, b: incrementBy3, c: incrementBy4, d: incrementBy5 });

        const state$ = new StateObservable(
          actions$.pipe(
            scan((state, action) => {
              const counterState = counterReducer(state.counter, action);
              return {
                counter: counterState
              };
            }, initialState),
          ),
          initialState,
        );

        const output$ = processIncrementByAmount(actions$, state$, { submit });
      
        expectObservable(output$).toBe('---');
        
        flush();
        expect(submit).toHaveBeenCalledTimes(2);
      });
    });

    it('logs each time we increment by an amount if the new amount > 5, using mock actions', () => {
      testScheduler.run(({ expectObservable, hot, flush }) => {
        const counterState: CounterState = { value: 0, status: 'idle' };
        const initialState = { counter: counterState };

        const incrementBy2 = incrementByAmount(mock<IncrementByAmountPayload>({ amount: 2 }));
        const incrementBy3 = incrementByAmount(mock<IncrementByAmountPayload>({ amount: 3 }));
        const incrementBy4 = incrementByAmount(mock<IncrementByAmountPayload>({ amount: 4 }));
        const incrementBy5 = incrementByAmount(mock<IncrementByAmountPayload>({ amount: 5 }));

        const actions$ = hot('-a-b-c-d', { a: incrementBy2, b: incrementBy3, c: incrementBy4, d: incrementBy5 });

        const state$ = new StateObservable(
          actions$.pipe(
            scan((state, action) => {
              return {
                counter: counterReducer(state.counter, action)
              };
            }, initialState),
          ),
          initialState,
        );

        const output$ = processIncrementByAmount(actions$, state$, { submit });
        
        expectObservable(output$).toBe('---');

        flush();
        expect(submit).toHaveBeenCalledTimes(2);
      });
    });    
  })
})

