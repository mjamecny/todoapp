const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Todo = require('../models/todoModel')
const AppError = require('../utils/appError')

// @desc add todo
// @route POST /api/todos
// @access Private

const addTodo = asyncHandler(async (req, res) => {
  const { task } = req.body
  const user = await User.findOne({ _id: req.user.id })

  if (!user) {
    return next(new AppError('User does not exist', 404))
  }

  Todo.create({ task, user: req.user.id })

  res.status(201).json({
    message: 'Task add to your list',
  })
})

// @desc delete todo
// @route DELETE /api/todos/:id
// @access Private

const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params
  const todo = await Todo.findByIdAndRemove({ _id: id })

  if (!todo) {
    return next(new AppError('No TODO find with that ID', 404))
  }

  res.status(204).json({
    message: 'TODO removed from your list',
  })
})

// @desc update todo
// @route PATCH /api/todos/:id
// @access Private

const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params

  const todo = await Todo.findById(id)

  if (!todo) {
    return next(new AppError('No TODO find with that ID', 404))
  }

  if (req.body.task) {
    todo.task = req.body.task

    await todo.save()
    return res.status(200).json({
      message: 'TODO successfully updated',
    })
  }

  if (todo.isCompleted === false) {
    todo.isCompleted = true
    await todo.save()

    res.status(200).json({
      message: 'Done',
    })
  } else {
    todo.isCompleted = false
    await todo.save()
    res.status(200)
  }
})

// @desc delete all todos
// @route DELETE /api/todos
// @access Private

const deleteAllTodos = asyncHandler(async (req, res) => {
  await Todo.deleteMany({ user: req.user.id })

  res.status(204).json({
    message: 'All TODOs removed from your list',
  })
})

// @desc get all vods
// @route GET /api/vods
// @access Private

const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user.id })
  res.status(200).json({ todos })
})

module.exports = {
  addTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  getTodos,
}
