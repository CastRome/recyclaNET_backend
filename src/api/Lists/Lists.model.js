const { Schema, model, models } = require('mongoose');

const ListsSchema = new Schema(
  {
    UserId: {
      type: String,
      required: [true, 'por favor ingrese un user'],
    },
    FavsId: {
      type: Array,
      ref: 'Favs',
      required: [true, 'por favor ingrese un fav'],
    },
  },
  {
    timestamps: true,
  },
);

const Lists = model('Lists', ListsSchema);

module.exports = Lists;
