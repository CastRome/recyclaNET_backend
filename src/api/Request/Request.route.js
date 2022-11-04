const router = require('express').Router();
const requestController = require('./Request.controller');
const { auth } = require('../Utils/auth');
const formData = require('./api/Utils/formData');

router.route('/').post(auth, formData, requestController.create);
router.route('/').get(requestController.list);
router.route('/:requestId').put(auth, requestController.update);

module.exports = router;
