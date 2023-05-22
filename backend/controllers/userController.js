const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Todo = require('../models/todoModel')
const Email = require('../utils/email')
const crypto = require('crypto')
const AppError = require('./../utils/appError')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
}

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET)
}

const saveRefreshToken = async (user, token) => {
  const currentUser = await User.findOne({ _id: user.id })

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    )
  }

  currentUser.refreshTokens.push(token)
  await currentUser.save()
}

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id)
  const refreshToken = signRefreshToken(user._id)

  // Remove password from output
  user.password = undefined

  saveRefreshToken(user, refreshToken)

  res.status(statusCode).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token,
    refreshToken,
  })
}

const getAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.body.refreshToken

  if (!refreshToken) {
    return next(new AppError('No refresh token', 401))
  }

  if (!req.user.refreshTokens.includes(refreshToken)) {
    return next(new AppError('', 403))
  }

  // 2) Verification token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id)

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    )
  }
  res
  const token = signToken(currentUser.id)

  res.status(200).json({
    token,
  })
})

// @desc Logout user
// @route POST /api/users/logout
// @access Private

const logout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== req.body.token
  )

  await user.save()

  res.status(204).json({
    message: 'Successfully logged out',
  })
})

// @desc Register user
// @route POST /api/users
// @access Public

const registerUser = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  })

  // Send welcome email
  const url = `${req.protocol}://${req.get('host')}/`
  await new Email(newUser, url).sendWelcome()

  createSendToken(newUser, 201, req, res)
})

// @desc Login user
// @route POST /api/users/login
// @access Public

const loginUser = asyncHandler(async (req, res, next) => {
  // 1) Get email and password from body
  const { email, password } = req.body

  // 2) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400))
  }

  // 3) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401))
  }

  if (!user.active) {
    return next(
      new AppError(
        'Your account has been deactivated. Please contact support if you have any questions.',
        401
      )
    )
  }

  // 4) If everything ok, send token to client
  createSendToken(user, 200, req, res)
})

// @desc Get user data
// @route POST /api/users/me
// @access Private

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// @desc Delete current user
// @route DELETE /api/users/deleteMe
// @access Private

const deleteMe = asyncHandler(async (req, res) => {
  const { id } = req.body

  const user = await User.findById(id)

  if (!user) {
    return next(new AppError('No user found', 404))
  }

  user.active = false

  await Todo.deleteMany({ user: user._id })

  await user.save()

  res.status(204).json({
    message: 'User has been deleted successfully.',
  })
})

// @desc Forgot password
// @route POST /api/users/forgotPassword
// @access Public

const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new AppError('There is no user with email address.', 404))
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // 3) Send it to user's email
  try {
    const resetURL =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/resetPassword/${resetToken}`
        : `https://vodhub.netlify.app/resetPassword/${resetToken}`

    await new Email(user, resetURL).sendPasswordReset()

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to your email!',
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    )
  }
})

// @desc Reset password
// @route PATCH /api/users/resetPassword/:token
// @access Public

const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }

  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res)
})

// @desc Get All Users
// @route GET /api/users
// @access Protect

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({ users })
})

// @desc Get user
// @route GET /api/users/:id
// @access Protect

const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findOne({ _id: id })

  res.status(200).json({ user })
})

// @desc Remove user
// @route DELETE /api/users/:id
// @access Protect

const removeUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  // Find the user by ID
  const user = await User.findById(id)

  // If the user doesn't exist, return a 404 error
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  // Delete the user
  await user.deleteOne()

  // Return a success message
  res.status(204).json({ message: 'User removed successfully' })
})

// @desc Update user
// @route PATCH /api/users/:id
// @access Protect

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  // Find the user by ID
  const user = await User.findById(id)

  // If the user doesn't exist, return a 404 error
  if (!user) {
    return next(new AppError('User not found', 404))
  }

  if (req.body.username) {
    user.username = req.body.username
  }

  if (req.body.email) {
    user.email = req.body.email
  }

  if (req.body.active) {
    user.active = req.body.active
  }

  // Save user
  await user.save()

  res.status(200).json({ user })
})

// @desc Update password
// @route PATCH /api/users/updatePassword
// @access Protect

const updatePassword = asyncHandler(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password')

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401))
  }

  // 3) If so, update password
  user.password = req.body.password

  await user.save()

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res)
})

module.exports = {
  registerUser,
  loginUser,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  getAccessToken,
  getAllUsers,
  getUser,
  removeUser,
  deleteMe,
  updateUser,
}
