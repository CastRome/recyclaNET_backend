const Requests = require('./Request.model');

module.exports = {
  //get all
  async list(req, res) {
    try {
      const requests = await Requests.find().select('-_id -UserId').populate({
        path: 'UserId',
        select: '-_id name role',
      });
      res.status(201).json({ message: 'requests found', data: requests });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  //getID
  async show(req, res) {
    try {
      const { requestsId } = req.params;
      const requests = await Requests.findById(requestsId)
        .select('-_id -UserId')
        .populate({
          path: 'UserId',
          select: '-_id name',
        });

      res.status(201).json({ message: 'requests found', data: requests });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // post

  async create(req, res) {
    try {
      //console.log(1);
      const data = req.body;
      const user = req.userId;
      //console.log('data', data);
      if (!user) {
        throw new Error('Favs invalido');
      }
      let matter = [];
      const valSplit = data.materials.split(',');
      valSplit.forEach((item) => matter.push(item));

      const newrequests = {
        ...data,
        materials: matter,
        userId: user,
      };
      //console.log('new', newrequests);

      const requests = await Requests.create(newrequests);
      res.status(201).json({ message: 'Requests Created', data: requests });
    } catch (error) {
      res.status(400).json({
        message: 'Requests could not be created',
        data: error.message,
      });
    }
  },
  //update
  async update(req, res) {
    try {
      const { favsId, requestsId } = req.params;
      const requests = await Requests.findById(requestsId);
      console.log('requests', requests);
      const favList = requests.FavsId;
      const userList = requests.UserId;
      favList.push(favsId);
      console.log('favList', favList);
      const user = req.userId;

      if (!user) {
        throw new Error('user invalido');
      }
      if (userList !== user) {
        throw new Error('user invalido');
      }

      const data = {
        UserId: user,
        FavsId: favList,
      };
      //console.log(data);
      const requestsUpdate = await Requests.findByIdAndUpdate(
        requestsId,
        data,
        {
          new: true,
        },
      );
      res
        .status(201)
        .json({ message: 'Requests Updated', data: requestsUpdate });
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Requests could not be Updated', data: error });
    }
  },
  //delete
  async destroy(req, res) {
    try {
      const { requestsId } = req.params;
      const requests = await Requests.findById(requestsId);

      const userList = requests.UserId;
      console.log('userList', userList);

      const user = req.userId;
      console.log('user', user);

      if (!user) {
        throw new Error('user invalido');
      }
      if (userList !== user) {
        throw new Error('user invalido');
      }
      const fav = await Requests.findByIdAndDelete(requestsId);
      res.status(200).json({ message: 'Comment Deleted', data: fav });
    } catch (error) {
      res
        .status(400)
        .json({ Message: 'Comment could not be Deleted', data: error });
    }
  },
};
