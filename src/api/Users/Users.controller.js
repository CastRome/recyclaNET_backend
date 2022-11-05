const { create } = require('./Users.model');
const User = require('./Users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter, welcome } = require('../Utils/mailer');

module.exports = {
  //get all

  async signup(req, res, next) {
    try {
      const data = req.body;
      //  console.log('singup_data', data);
      //brcypt recibe (password,Salto)
      const encPassword = await bcrypt.hash(data.password, 8);
      const { password } = data;
      const passRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passRegex.test(password)) {
        throw new Error('Password not secure');
      }
      const newUser = {
        ...data,
        password: encPassword,
      };

      const user = await User.create(newUser);

      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
      });
      await transporter.sendMail(welcome(newUser));
      res.status(201).json({
        message: 'User created',
        data: { email: data.email, token, role: data.role },
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: 'User could not created', error: err.message });
      next(err);
    }
  },

  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      console.log('antes de user', user);
      if (!user) {
        throw new Error('Email o contraseña invalidos');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Email o contraseña invalidos');
      }

      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
      });

      const role = user.role;
      res.status(201).json({
        message: 'User login successfully',
        data: { email, token, role },
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: 'User could not login', data: err.message });
    }
  },
  /* 
  async list(req, res) {
    try {
      const user = await User.find().select('-_id -password');

      res.status(201).json({ message: 'user found', data: user });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  //getID
  async show(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId, '-_id -password');
      //populates
      res.status(201).json({ message: 'user found', data: user });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  async update(req, res) {
    try {
      const data = req.body;
      const { userId } = req.params;
      const user = await User.findByIdAndUpdate(userId, data, { new: true });
      res.status(200).json({ message: 'User Updated', data: user });
    } catch (err) {
      res.status(400).json({ message: 'User could not be Updated', data: err });
    }
  },

  async destroy(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'User Deleted', data: user });
    } catch (error) {
      res.status(400).json({ Message: 'User could not be Deleted', data: err });
    }
  }, */
};
