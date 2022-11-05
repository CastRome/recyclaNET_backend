const { Schema, model, models } = require('mongoose');

const RequestsSchema = new Schema(
  {
    city: {
      type: String,
      required: [true, 'Debe ingresar una ciudad.'],
    },
    direction: {
      type: String,
      required: [true, 'Debe ingresar un direccion.'],
    },
    location: {
      type: Array,
      required: [false, 'Debe ingresar unas coordenadas.'],
    },
    date: {
      type: Array,
      required: [true, 'Debe ingresar una fecha.'],
    },
    hour: {
      type: String,
      required: [true, 'Debe selec.'],
    },
    materials: {
      type: Array,
      required: [true, 'Debe ingresar por lo menos un material.'],
    },
    images: {
      type: Array,
      required: [true, 'Debe ingresar las imagenes del pedido.'],
    },

    userId: {
      type: String,
      ref: 'Users',
      required: [true, 'Debe tener un usuario.'],
    },
    recyclerId: {
      type: String,
      ref: 'Users',
      required: [false, 'Debe tener un reciclador.'],
    },
    state: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const Requests = model('Requests', RequestsSchema);

module.exports = Requests;
