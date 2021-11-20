const router = require('express').Router()

const {
  create,
  getDispatchers,
  suspend,
  remove,
  activeDispatchers,
  inactiveDispatchers,
  reactivate,
  searchInactiveDispatchers,
  searchActiveDispatchers,
} = require('../controllers/dispatchController')
const { protect, admin } = require('../middleware/authMiddleware')

router.route('/').get(protect, admin, getDispatchers)

router.route('/suspend/:id').get(protect, admin, suspend)

router.route('/delete/:id').get(protect, admin, remove)

router.route('/reactivate/:id').get(protect, admin, reactivate)

router.route('/active').get(protect, admin, activeDispatchers)

router.route('/inactive').get(protect, admin, inactiveDispatchers)

router.route('/create').post(protect, admin, create)

router.route('/searchactive').post(protect, admin, searchActiveDispatchers)

router.route('/searchinactive').post(protect, admin, searchInactiveDispatchers)

module.exports = router
