const router = require('express').Router();
const favsController = require('./Favs.controller');
const { auth } = require('../Utils/auth');

router.route('/').get(favsController.list);
router.route('/:favsId').get(favsController.show);
router.route('/').post(auth, favsController.create);
router.route('/:favsId').put(auth, favsController.update);
router.route('/:favsId').delete(auth, favsController.destroy);

module.exports = router;
