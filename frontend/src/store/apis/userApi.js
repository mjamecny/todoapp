import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      import.meta.env.DEV
        ? 'http://localhost:5000'
        : 'https://vodhub-api.onrender.com'
    }/api/users`,
  }),
  endpoints(builder) {
    return {
      register: builder.query({
        query: (data) => {
          const { username, email, password } = data
          return {
            body: {
              username,
              email,
              password,
            },
            method: 'POST',
          }
        },
      }),
      login: builder.query({
        query: (data) => {
          const { email, password } = data
          return {
            url: '/login',
            body: {
              email,
              password,
            },
            method: 'POST',
          }
        },
      }),
      logout: builder.query({
        query: (data) => {
          const { authToken, refreshToken } = data
          return {
            url: '/logout',
            body: {
              token: refreshToken,
            },
            headers: {
              authorization: authToken,
            },
            method: 'DELETE',
          }
        },
      }),
      forgotPassword: builder.query({
        query: (data) => {
          const { email } = data
          return {
            url: '/forgotPassword',
            body: {
              email,
            },
            method: 'POST',
          }
        },
      }),
      resetPassword: builder.query({
        query: (data) => {
          const { password, token } = data
          return {
            url: `/resetPassword/${token}`,
            body: {
              password,
            },
            method: 'PATCH',
          }
        },
      }),
      getAppUsers: builder.query({
        query: (data) => {
          const { token } = data
          return {
            url: '/',
            headers: {
              authorization: token,
            },
            method: 'GET',
          }
        },
        providesTags: ['USER'],
      }),
      removeUser: builder.mutation({
        query: (data) => {
          const { id, token } = data
          return {
            url: `/${id}`,
            headers: {
              authorization: token,
            },
            method: 'DELETE',
          }
        },
        invalidatesTags: ['USER'],
      }),
      updateUser: builder.mutation({
        query: (data) => {
          return {
            url: `/${data.id}`,
            headers: {
              authorization: data.token,
            },
            body: data.body,
            method: 'PATCH',
          }
        },
        invalidatesTags: ['USER'],
      }),
      updatePassword: builder.mutation({
        query: (data) => {
          const { token, password, passwordCurrent } = data
          return {
            url: `/updatePassword`,
            headers: {
              authorization: token,
            },
            body: {
              passwordCurrent,
              password,
            },
            method: 'PATCH',
          }
        },
        invalidatesTags: ['USER'],
      }),
      removeCurrentUser: builder.mutation({
        query: (data) => {
          const { id, token } = data
          return {
            url: `/deleteMe`,
            headers: {
              authorization: token,
            },
            body: {
              id,
            },
            method: 'DELETE',
          }
        },
        invalidatesTags: ['USER'],
      }),
    }
  },
})

export const {
  useLazyRegisterQuery,
  useLazyLoginQuery,
  useLazyForgotPasswordQuery,
  useLazyResetPasswordQuery,
  useLazyLogoutQuery,
  useRemoveUserMutation,
  useGetAppUsersQuery,
  useRemoveCurrentUserMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
} = userApi
export { userApi }
