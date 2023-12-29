import { mock } from 'jest-mock-extended';

import { counterSlice, type IncrementByAmountPayload, type CounterState } from './counterSlice';

const counterReducer = counterSlice.reducer;

const incrementAction = counterSlice.actions.incrementByAmount;

describe('Counter', () => {
   test('reducer returns new object', () => {
      const state: CounterState = {
         value: 5,
         status: 'idle'
      }

      const actionPayload = { amount: 8 };
      const action = incrementAction(actionPayload);

      const state1 = counterReducer(state, action);
      const state2 = counterReducer(state, action);
       
      expect(state1).not.toBe(state2);
   });

   test('reducer returns new object when state is mocked', () => {
      const state = mock<CounterState>({
         value: 5,
         status: 'idle'
      })

      const actionPayload = { amount: 8 };
      const action = incrementAction(actionPayload);

      const state1 = counterReducer(state, action);
      const state2 = counterReducer(state, action);

      // This test will fail because we are using `mock()` to generate our state object
      expect(state1).not.toBe(state2);
   });   

   test('reducer returns new object when action is mocked', () => {
      const state: CounterState = {
         value: 5,
         status: 'idle'
      }
      const actionPayload = mock<IncrementByAmountPayload>();
      const action = incrementAction(actionPayload);

      const state1 = counterReducer(state, action);
      const state2 = counterReducer(state, action);
       
      expect(state1).not.toBe(state2);
   });
});