import { createStore } from "redux";

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
  }
}

export default createStore(reducer)
