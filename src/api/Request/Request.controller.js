const Requests = require('./Request.model');
const Users = require('../Users/Users.model');
const {
  transporter,
  created,
  completeRecycler,
  completeUser,
  aceptedUser,
  aceptedRecycler,
} = require('../Utils/mailer');
module.exports = {
  //get all
  async list(req, res) {
    try {
      const user = req.userId;
      //console.log('data', data);
      if (!user) {
        throw new Error('Favs invalido');
      }
      const requests = await Requests.find({ userId: user })
        .select(' ')
        .populate({
          path: 'userId',
          select: '-_id name role lastname email',
        })
        .populate({
          path: 'recyclerId',
          select: '-_id name role lastname email',
        });
      res.status(201).json({ message: 'requests found', data: requests });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  async listPending(req, res) {
    try {
      const user = req.userId;
      //console.log('data', data);
      if (!user) {
        throw new Error('Favs invalido');
      }
      const requests = await Requests.find({
        state: 'pending',
      })
        .select(' ')
        .populate({
          path: 'userId',
          select: '-_id name role lastname email',
        })
        .populate({
          path: 'recyclerId',
          select: '-_id name role lastname email',
        });
      res.status(201).json({ message: 'requests found', data: requests });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  async listProgress(req, res) {
    try {
      const user = req.userId;
      //console.log('data', data);
      if (!user) {
        throw new Error('Favs invalido');
      }
      const requests = await Requests.find({
        recyclerId: user,
        state: 'in_progress',
      })
        .select(' ')
        .populate({
          path: 'userId',
          select: '-_id name role lastname email',
        })
        .populate({
          path: 'recyclerId',
          select: '-_id name role lastname email',
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
          path: 'userId',
          select: '-_id name lastname email',
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

      const user = await Users.findById(req.userId);

      if (!user._id) {
        throw new Error('Favs invalido');
      }
      let matter = [];
      const valSplit = data.materials.split(',');
      valSplit.forEach((item) => matter.push(item));

      const newrequests = {
        ...data,
        materials: matter,
        userId: req.userId,
      };
      data.materials = matter;

      const requests = await Requests.create(newrequests);
      await transporter.sendMail(created(user, requests));

      res.status(201).json({
        message: 'Requests Created',
        data: { data, id: requests._id },
      });
    } catch (error) {
      res.status(400).json({
        message: 'Requests could not be created',
        data: error.message,
      });
    }
  },
  //
  async cancel(req, res) {
    try {
      const { requestId } = req.params;

      const requests = await Requests.findById(requestId);

      const user = req.userId;
      const userList = requests.userId[0];
      console.log('user', user);
      console.log('userList', userList);
      if (!user) {
        throw new Error('user invalido');
      }
      if (userList !== user) {
        throw new Error('user invalido');
      }

      requests.state = 'cancel';

      //console.log(requestId, 'new', requestsPut._doc);
      const requestsUpdate = await Requests.findByIdAndUpdate(
        requestId,
        requests,
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
  async aceptar(req, res) {
    try {
      const { requestId } = req.params;
      const requests = await Requests.findById(requestId);
      const user = await Users.findById(req.userId);
      // const userUser =

      console.log('user', user);

      if (!user._id) {
        throw new Error('user invalido');
      }
      requests.recyclerId.push(user._id);
      requests.state = 'in_progress';
      //console.log(requestId, 'new', requestsPut._doc);
      const requestsUpdate = await Requests.findByIdAndUpdate(
        requestId,
        requests,
        {
          new: true,
        },
      );

      const userUser = await Users.findById(requests.userId);
      await transporter.sendMail(aceptedRecycler(userUser, requests, user));
      await transporter.sendMail(aceptedUser(userUser, requests, user));

      res
        .status(201)
        .json({ message: 'Requests Updated', data: requestsUpdate });
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Requests could not be Updated', data: error });
    }
  },
  async completar(req, res) {
    try {
      const { requestId } = req.params;
      const requests = await Requests.findById(requestId);
      //const user = req.userId;
      const user = await Users.findById(req.userId);
      if (!user._id) {
        throw new Error('user invalido');
      }

      requests.state = 'complete';
      //console.log(requestId, 'new', requestsPut._doc);
      const requestsUpdate = await Requests.findByIdAndUpdate(
        requestId,
        requests,
        {
          new: true,
        },
      );

      const userUser = await Users.findById(requests.userId);
      await transporter.sendMail(completeRecycler(user, requests));
      await transporter.sendMail(completeUser(userUser, requests));
      res
        .status(201)
        .json({ message: 'Requests Updated', data: requestsUpdate });
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Requests could not be Updated', data: error });
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
      req.userId;
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
