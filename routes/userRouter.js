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
  adminUser,
  editUser,
  changepic,
} = require('../controllers/userController')
const { admin, protect } = require('../middleware/authMiddleware')

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/').get(protect, admin, getAllUsers)

router.route('/:userId').get(protect, admin, getUserById)

router.route('/admin/:id').get(protect, admin, adminUser)

router.route('/roles').post(protect, admin, postRole)

router.route('/getRoles').get(protect, admin, getAllRoles)

router.route('/forgot').post(forgotPassword)

router.route('/reset').post(resetPassword)

router.route('/change').post(protect, changePassword)

router.route('/edit').post(protect, editUser)

router.route('/changepic').post(protect, changepic)

router.route('/delete/:id').delete(protect, admin, deleteUser)

module.exports = router
