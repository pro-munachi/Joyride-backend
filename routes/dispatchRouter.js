const router = require('express').Router()

const { create, getDispatchers } = require('../controllers/dispatchController')
const { protect, admin } = require('../middleware/authMiddleware')

router.route('/').get(protect, admin, getDispatchers)
router.route('/create').post(protect, admin, create)

module.exports = router
