import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  user: false,
  sessionId: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setSessionId(state, action) {
      state.sessionId = action.payload.sessionId;
    },
    removeSessionId(state, action) {
      state.sessionId = null;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const {setUser, setSessionId, removeSessionId} = slice.actions;
