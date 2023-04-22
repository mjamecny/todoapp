import { createSlice, createSelector } from '@reduxjs/toolkit'

const initialState = {
  todos: JSON.parse(localStorage.getItem('todos')) || [],
  // todos: [
  //   {
  //     id: 1,
  //     task: 'Buy groceries',
  //     isCompleted: false,
  //     isEditing: false,
  //   },
  //   {
  //     id: 2,
  //     task: 'Clean the house',
  //     isCompleted: true,
  //     isEditing: false,
  //   },
  //   {
  //     id: 3,
  //     task: 'Do laundry',
  //     isCompleted: false,
  //     isEditing: true,
  //   },
  //   {
  //     id: 4,
  //     task: 'Take out the trash',
  //     isCompleted: false,
  //     isEditing: false,
  //   },
  //   {
  //     id: 5,
  //     task: 'Pay bills',
  //     isCompleted: true,
  //     isEditing: false,
  //   },
  //   {
  //     id: 6,
  //     task: 'Walk the dog',
  //     isCompleted: false,
  //     isEditing: true,
  //   },
  //   {
  //     id: 7,
  //     task: 'Mow the lawn',
  //     isCompleted: false,
  //     isEditing: false,
  //   },
  //   {
  //     id: 8,
  //     task: 'Wash the car',
  //     isCompleted: false,
  //     isEditing: false,
  //   },
  //   {
  //     id: 9,
  //     task: 'Read a book',
  //     isCompleted: true,
  //     isEditing: false,
  //   },
  //   {
  //     id: 10,
  //     task: 'Write a letter',
  //     isCompleted: false,
  //     isEditing: true,
  //   },
  //   {
  //     id: 11,
  //     task: 'Call a friend',
  //     isCompleted: false,
  //     isEditing: false,
  //   },
  //   {
  //     id: 12,
  //     task: "Schedule a doctor's appointment",
  //     isCompleted: false,
  //     isEditing: false,
  //   },
  //   {
  //     id: 13,
  //     task: 'Go for a bike ride',
  //     isCompleted: true,
  //     isEditing: false,
  //   },
  //   {
  //     id: 14,
  //     task: 'Finish a project',
  //     isCompleted: false,
  //     isEditing: true,
  //   },
  //   {
  //     id: 15,
  //     task: 'Organize the closet',
  //     isCompleted: false,
  //     isEditing: false,
  //   },
  //   {
  //     id: 16,
  //     task: 'Watch a movie',
  //     isCompleted: false,
  //     isEditing: false,
  //   },
  //   {
  //     id: 17,
  //     task: 'Take a nap',
  //     isCompleted: true,
  //     isEditing: false,
  //   },
  //   {
  //     id: 18,
  //     task: 'Learn a new skill',
  //     isCompleted: false,
  //     isEditing: true,
  //   },
  //   {
  //     id: 19,
  //     task: 'Cook dinner',
  //     isCompleted: false,
  //     isEditing: false,
  //   },
  //   {
  //     id: 20,
  //     task: 'Plan a vacation',
  //     isCompleted: false,
  //     isEditing: false,
  //   },
  // ],
  filter: 'all',
}

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.todos.push(action.payload)
    },

    checkTodo: (state, action) => {
      const todo = state.todos.find((todo) => todo.id === action.payload)
      todo.isCompleted = !todo.isCompleted
    },
    editTodo: (state, action) => {
      const todo = state.todos.find((todo) => todo.id === action.payload)
      todo.isEditing = !todo.isEditing
    },

    updateTodo: (state, action) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id)
      todo.task = action.payload.task
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload)
    },
    deleteAll: (state) => {
      state.todos = []
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setFilter, (state, action) => {
      state.filter = action.payload
    })
  },
})

export const selectTodos = (state) => state.todo.todos
export const selectFilter = (state) => state.todo.filter

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.isCompleted)
      case 'completed':
        return todos.filter((todo) => todo.isCompleted)
      default:
        return todos
    }
  }
)

export const {
  addTodo,
  checkTodo,
  editTodo,
  updateTodo,
  deleteTodo,
  deleteAll,
  setFilter,
} = todoSlice.actions

export default todoSlice.reducer
