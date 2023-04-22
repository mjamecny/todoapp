import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import todoReducer from './slices/todoSlice'
import appReducer from './slices/appSlice'

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
  },
})

setupListeners(store.dispatch)
export {
  addTodo,
  checkTodo,
  editTodo,
  updateTodo,
  deleteTodo,
  deleteAll,
  setFilter,
  selectFilteredTodos,
} from './slices/todoSlice'
export { setTask } from './slices/appSlice'
