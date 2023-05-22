const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  logout,
  getAccessToken,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  getAllUsers,
  getUser,
  removeUser,
  deleteMe,
  updateUser,
} = require('../controllers/userController')

const { protect, restrictTo } = require('../middleware/authMiddleware')

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.patch('/updatePassword', protect, updatePassword)
router.post('/', registerUser)
router.post('/login', loginUser)
router.delete('/logout', protect, logout)
router.get('/me', protect, getMe)
router.delete('/deleteMe', protect, deleteMe)
router.post('/token', protect, getAccessToken)

router.get('/', protect, restrictTo('admin'), getAllUsers)
router
  .route('/:id')
  .get(protect, restrictTo('admin'), getUser)
  .delete(protect, restrictTo('admin'), removeUser)
  .patch(protect, restrictTo('admin'), updateUser)

module.exports = router
