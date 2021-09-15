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
const { protect } = require('../middleware/authMiddleware')

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/').get(getAllUsers)

router.route('/:userId').get(getUserById)

router.route('/roles').post(postRole)

router.route('/getRoles').get(getAllRoles)

router.route('/forgot').post(forgotPassword)

router.route('/reset').post(resetPassword)

router.route('/change').post(protect, changePassword)

module.exports = router
