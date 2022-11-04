const router = require('express').Router();
const listsController = require('./Lists.controller');
const { auth } = require('../Utils/auth');

router.route('/').get(listsController.list);
router.route('/:listsId').get(listsController.show);
router.route('/:favsId').post(auth, listsController.create);
router.route('/:listsId/:favsId').put(auth, listsController.update);
router.route('/:listsId').delete(auth, listsController.destroy);

module.exports = router;
