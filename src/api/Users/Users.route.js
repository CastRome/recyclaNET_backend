const router = require('express').Router();
const userController = require('./Users.controller');

//router.route('/').get(userController.list);
//router.route('/:userId').get(userController.show);
//router.route('/:userId').put(userController.update);
//router.route('/:userId').delete(userController.destroy);
router.route('/signup').post(userController.signup);
router.route('/login').post(userController.signin);

module.exports = router;
