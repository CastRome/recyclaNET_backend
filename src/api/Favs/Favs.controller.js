const Favs = require('./Favs.model');

module.exports = {
  //get all
  async list(req, res) {
    try {
      const favs = await Favs.find();
      res.status(201).json({ message: 'favs found', data: favs });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  //getID
  async show(req, res) {
    try {
      const { favsId } = req.params;
      const favs = await Favs.findById(favsId);

      res.status(201).json({ message: 'favs found', data: favs });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // post

  async create(req, res) {
    try {
      const newfavs = req.body;

      const user = req.userId;
      if (!user) {
        throw new Error('User invalid');
      }

      const favs = await Favs.create(newfavs);

      res.status(201).json({ message: 'Favs Created', data: favs });
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Favs could not be created', data: error });
    }
  },
  //update
  async update(req, res) {
    try {
      const data = req.body;
      const { favsId } = req.params;
      /*const user = req.userId;
      let { userId } = await Favs.findById(commentId);

      if (!userId) {
        throw new Error('Favs invalido');
      }

      if (userId._id.valueOf() !== user) {
        throw new Error('Usuario invalido');
      }
    */
      const favsUpdate = await Favs.findByIdAndUpdate(favsId, data, {
        new: true,
      });
      res.status(200).json({ message: 'Favs Updated', data: favsUpdate });
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Favs could not be Updated', data: error });
    }
  },
  //delete
  async destroy(req, res) {
    try {
      const user = req.userId;
      const { favId } = req.params;
      let { userId } = await Favs.findById(favId);

      if (userId._id.valueOf() !== user) {
        throw new Error('Usuario invalido');
      }

      const fav = await Favs.findByIdAndDelete(favId);
      res.status(200).json({ message: 'Favs Deleted', data: fav });
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Favs could not be Deleted', data: error });
    }
  },
};
