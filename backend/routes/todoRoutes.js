const express = require('express')
const router = express.Router()
const {
  addTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  getTodos,
} = require('../controllers/todoController')
const { protect } = require('../middleware/authMiddleware')

router
  .route('/')
  .get(protect, getTodos)
  .post(protect, addTodo)
  .delete(protect, deleteAllTodos)
router.route('/:id').delete(protect, deleteTodo).patch(protect, updateTodo)

module.exports = router
