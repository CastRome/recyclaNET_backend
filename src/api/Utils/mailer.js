const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

exports.verify = async (transporter) => {
  const connection = await transporter.verify();

  if (connection) {
    console.log('Server is ready to take our messages');
  }
};

exports.welcome = (user) => {
  return {
    from: `"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: user.email,
    subject: 'Welcome',
    html: `
      <div>
        <h1> Welcome ${user.name}</h1>
        <p> Thank you for register in  reciclaNET-top24 </p>
        <p> we hope you can create a lot of "real" request</p>
        <p> or re-"use" the materials of others</p>
      </div>
    `,
    text: `Bienvenido ${user.name}`,
  };
};
exports.created = (user, requests) => {
  return {
    from: `"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: user.email,
    subject: 'new request',
    html: `
      <div>
        <h1> Dear ${user.name}</h1>
        <p> Your order ${requests._id} was created successfuly </p>
        <p> please have everything in order the ${requests.date} - ${requests.hour} </p>
        <p> we will send you another email with the updates</p>
      </div>
    `,
    text: `new request ${requests._id}`,
  };
};

exports.aceptedRecycler = (user, requests, userUser) => {
  return {
    from: `"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: user.email,
    subject: 'new request',
    html: `
      <div>
        <h1> Dear ${user.name}</h1>
        <p> thank you for taking the order ${requests._id}  </p>
        <p> please schedule for the ${requests.date} - ${requests.hour} </p>
        <p> ${userUser.name} ${userUser.lastname} will be waiting for you at ${requests.direction} </p>
      </div>
    `,
    text: `new request ${requests._id}`,
  };
};

exports.aceptedUser = (user, requests, recycler) => {
  return {
    from: `"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: user.email,
    subject: 'request acepted',
    html: `
      <div>
        <h1> Dear ${user.name}</h1>
        <p> Your order ${requests._id} was assing to ${recycler.name} ${recycler.lastname} </p>
        <p> please have everything in order the ${requests.date} - ${requests.hour} </p>
        <p> we will send you another email with the updates</p>
      </div>
    `,
    text: `new request ${requests._id}`,
  };
};

exports.completeUser = (user, requests) => {
  return {
    from: `"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: user.email,
    subject: 'request compled',
    html: `
      <div>
        <h1> Dear ${user.name}</h1>
        <p> Your order ${requests._id} is complete </p>
        <p> please continue to use our service </p>
        
      </div>
    `,
    text: `new request ${requests._id}`,
  };
};

exports.completeRecycler = (user, requests) => {
  return {
    from: `"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: user.email,
    subject: 'request compled',
    html: `
      <div>
        <h1> Dear ${user.name}</h1>
        <p> Thank you for completing the order ${requests._id} </p>
        <p> please continue to use our service, we hope its been usefull</p>
        
      </div>
    `,
    text: `new request ${requests._id}`,
  };
};
