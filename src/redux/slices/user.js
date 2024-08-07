import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  user: false,
  userId: null,
  sessionId: null,
  hostIp: null,
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
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setSessionId(state, action) {
      state.sessionId = action.payload.sessionId;
    },
    removeSessionId(state, action) {
      state.sessionId = null;
    },
    setHostIp(state, action) {
      state.hostIp = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const {setUser, setUserId, setSessionId, removeSessionId, setHostIp} =
  slice.actions;
