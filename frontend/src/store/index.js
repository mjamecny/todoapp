import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { todoApi } from './apis/todoApi'
import { userApi } from './apis/userApi'

export const store = configureStore({
  reducer: {
    [todoApi.reducerPath]: todoApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(todoApi.middleware)
      .concat(userApi.middleware)
  },
})

setupListeners(store.dispatch)

export {
  useAddMutation,
  useUpdateMutation,
  useGetTodosQuery,
  useRemoveMutation,
  useRemoveAllMutation,
} from './apis/todoApi'

export {
  useLazyRegisterQuery,
  useLazyLoginQuery,
  useLazyForgotPasswordQuery,
  useLazyResetPasswordQuery,
  useLazyLogoutQuery,
  useGetAppUsersQuery,
  useRemoveUserMutation,
  useRemoveCurrentUserMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
} from './apis/userApi'
