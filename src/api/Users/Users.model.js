const { Schema, model, models } = require('mongoose');
const emailRegex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');

const UsersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Debe ingresar un nombre.'],
      minlength: [4, 'El nombre es muy corto'],
      maxlength: [20, 'El nombre es muy largo'],
    },
    lastname: {
      type: String,
      required: [true, 'Debe ingresar un apellido.'],
      minlength: [4, 'El nombre es muy corto'],
      maxlength: [20, 'El nombre es muy largo'],
    },
    city: {
      type: String,
      required: [true, 'Debe ingresar una ciudad.'],
    },
    direction: {
      type: String,
      required: false,
    },
    location: {
      type: Array,
      required: false,
    },
    Request: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Requests' }],
      required: false,
    },
    role: {
      type: String,
      required: [true, 'Debe ingresar una ciudad.'],
      enum: {
        values: ['admin', 'user', 'recycler'],
        message: 'Invalid role',
      },
    },
    email: {
      type: String,
      required: [true, 'Debe ingresar un correo electronico.'],
      match: [emailRegex, 'Ingrese un correo electronico valido'],
      validate: [
        {
          async validator(value) {
            try {
              const user = await models.Users.findOne({ email: value });
              return !user;
            } catch {
              console.log('no user');
              return false;
            }
          },
          message: 'Ya existe un usuario registrado con ese correo',
        },
      ],
    },
    password: {
      type: String,
      required: [true, 'Debe ingresar una contraseña.'],
    },
  },
  {
    timestamps: true,
  },
);
const Users = model('Users', UsersSchema);

module.exports = Users;
