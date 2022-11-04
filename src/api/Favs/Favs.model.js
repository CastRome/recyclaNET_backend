const { Schema, model, models } = require('mongoose');

const favsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'por favor ingrese un titulo'],
    },
    description: {
      type: String,
      required: [true, 'por favor ingrese una descripcion'],
    },
    link: {
      type: String,
      required: [true, 'por favor ingrese un enlace'],
    },
  },
  {
    timestamps: true,
  },
);

const Favs = model('Favs', favsSchema);

module.exports = Favs;
