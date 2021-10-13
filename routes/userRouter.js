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
} = require('../controllers/userController')
const { admin, protect } = require('../middleware/authMiddleware')

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/').get(admin, getAllUsers)

router.route('/:userId').get(admin, getUserById)

router.route('/roles').post(admin, postRole)

router.route('/getRoles').get(admin, getAllRoles)

router.route('/forgot').post(forgotPassword)

router.route('/reset').post(resetPassword)

router.route('/change').post(protect, changePassword)

module.exports = router
