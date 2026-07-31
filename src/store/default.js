// Minimal store with the same interface as the previous redux store
// (getState / dispatch / subscribe) — no external dependency needed.

const initialState = {
  userIPv6Data: {
    testRun: false,
    isIPv6: false,
    ispName: null,
    ipv4Address: null,
    ipv6Address: null,
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        userIPv6Data: {
          ...state.userIPv6Data,
          ...action.payload
        }
      };
    default:
      return state;
  }
}

const createStore = (reduce) => {
  let state = reduce(undefined, { type: '@@INIT' });
  const listeners = new Set();

  return {
    getState: () => state,
    dispatch: (action) => {
      state = reduce(state, action);
      listeners.forEach(listener => listener());
      return action;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export default createStore(reducer)
