import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      import.meta.env.DEV
        ? 'http://localhost:5000'
        : 'https://vodhub-api.onrender.com'
    }/api/todos`,
  }),
  tagTypes: ['TODO'],
  endpoints(builder) {
    return {
      add: builder.mutation({
        query: (data) => {
          const { token, task } = data
          return {
            url: '/',
            body: {
              task,
            },
            headers: {
              authorization: token,
            },
            method: 'POST',
          }
        },
        invalidatesTags: ['TODO'],
      }),
      update: builder.mutation({
        query: (data) => {
          return {
            url: `/${data.id}`,
            headers: {
              authorization: data.token,
            },
            body: {
              task: data.task,
            },
            method: 'PATCH',
          }
        },
        invalidatesTags: ['TODO'],
      }),
      remove: builder.mutation({
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
        invalidatesTags: ['TODO'],
      }),
      removeAll: builder.mutation({
        query: (data) => {
          const { token } = data
          return {
            url: `/`,
            headers: {
              authorization: token,
            },
            method: 'DELETE',
          }
        },
        invalidatesTags: ['TODO'],
      }),
      getTodos: builder.query({
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
        providesTags: ['TODO'],
      }),
    }
  },
})

export const {
  useAddMutation,
  useUpdateMutation,
  useGetTodosQuery,
  useRemoveMutation,
  useRemoveAllMutation,
} = todoApi
export { todoApi }
