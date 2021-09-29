const router = require('express').Router()

const {
  getNotify,
  getById,
  updateAllUsers,
} = require('../controllers/notificationController')
const { protect } = require('../middleware/authMiddleware')

router.route('/getUser').get(protect, getNotify)
router.route('/updateUsers').get(protect, updateAllUsers)
router.route('/:id').get(protect, getById)

module.exports = router
