import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  task: '',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTask(state, action) {
      state.task = action.payload
    },
  },
})

export const { setTask } = appSlice.actions
export default appSlice.reducer
