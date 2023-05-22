const mongoose = require('mongoose')
const validator = require('validator')

const todoSchema = mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, 'Please add task'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Todo', todoSchema)
