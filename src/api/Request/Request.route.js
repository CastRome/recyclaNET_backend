const router = require('express').Router();
const requestController = require('./Request.controller');
const { auth } = require('../Utils/auth');
const formData = require('../Utils/formData');

router.route('/').post(auth, formData, requestController.create);
router.route('/').get(auth, requestController.list);
router.route('/pending').get(auth, requestController.listPending);
router.route('/progress').get(auth, requestController.listProgress);
router.route('/:requestId').put(auth, requestController.update);
router.route('/cancel/:requestId').put(auth, requestController.cancel);
router.route('/aceptar/:requestId').put(auth, requestController.aceptar);
router.route('/complete/:requestId').put(auth, requestController.completar);
module.exports = router;
