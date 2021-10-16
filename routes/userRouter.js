const router = require('express').Router()
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getAllRoles,
  postRole,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteUser,
} = require('../controllers/userController')
const { admin, protect } = require('../middleware/authMiddleware')

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/').get(protect, admin, getAllUsers)

router.route('/:userId').get(protect, admin, getUserById)

router.route('/roles').post(protect, admin, postRole)

router.route('/getRoles').get(protect, admin, getAllRoles)

router.route('/forgot').post(forgotPassword)

router.route('/reset').post(resetPassword)

router.route('/change').post(protect, changePassword)

router.route('/delete/:id').delete(protect, admin, deleteUser)

module.exports = router
