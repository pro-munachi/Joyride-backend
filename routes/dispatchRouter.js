const router = require('express').Router()

const {
  create,
  getDispatchers,
  suspend,
  remove,
  activeDispatchers,
  inactiveDispatchers,
  reactivate,
} = require('../controllers/dispatchController')
const { protect, admin } = require('../middleware/authMiddleware')

router.route('/').get(protect, admin, getDispatchers)

router.route('/suspend/:id').get(protect, admin, suspend)

router.route('/delete/:id').get(protect, admin, remove)

router.route('/reactivate/:id').get(protect, admin, reactivate)

router.route('/active/:id').get(protect, admin, activeDispatchers)

router.route('/inactive/:id').get(protect, admin, inactiveDispatchers)

router.route('/create').post(protect, admin, create)

module.exports = router
