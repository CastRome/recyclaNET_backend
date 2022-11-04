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
    subject: 'Bienvenido',
    html: `
      <div>
        <h1> Bienvenido ${user.name}</h1>
        <p> Gracias por registrarse en reciclaNET-top24 </p>
        <p> esperamos que cree muchas solicitudes de reciclaje ficticias y </p>
        <p> tambien puedan re-"utilizar" los materiales</p>
      </div>
    `,
    text: `Bienvenido ${user.name}`,
  };
};
