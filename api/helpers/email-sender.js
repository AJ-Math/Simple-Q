const mailer = require('nodemailer');
const custom = sails.config.custom;

module.exports = {


	friendlyName: 'Email Sender',


	description: 'Send emails',


	inputs: {
		data: {
			friendlyName: 'Data',
			description: 'Data needed to send email',
			type: 'ref'
		},
	},


	fn: async function (inputs, exits) {
		sails.log("Sending email...");
		var data = inputs.data;

		if(!data || !data.recipient || !data.subject || !data.message) {
			sails.log.error("Invalid data ", data);
			throw "Invalid data";
		}
		// Finding email address
		var auth = await Config.find({
			where: { name: ['System.Email.User', 'System.Email.Pass'] },
			select: ['name', 'value']
		}).catch(function(err) {
			sails.log.error("Failed to get email. Error: ", err);
			throw "Failed to get email";
		});
		var account = {};

		auth.forEach(element=> {
			if(element.name === 'System.Email.User') {
				account.email = element.value;
			} else if(element.name === 'System.Email.Pass') {
				account.pass = element.value;
			}
		});
		// Decrypting
		var pass = await sails.helpers.encrypterDecrypter('decrypt', account.pass)
		 .catch(function(err) {
			sails.log.error("Failed to decrypt. ", err);
			throw "Failed to decrypt";
		});
		// Preparing to send email
		var transporter = mailer.createTransport({
			host: custom.mailer.host,
			port: custom.mailer.port,
			auth: {
				user: account.email,
				pass: pass
			}
		});
		var mailOptions = {
			from: custom.mailer.from,
			to: data.recipient,
			subject: data.subject,
			html: data.message
		};
		// Sending email
		var mailSent = await transporter.sendMail(mailOptions).catch(function(err) {
			sails.log.error("Failed to send email. Error: ", err);
			throw "Failed to send email";
		});

		if(!mailSent) {
			sails.log.error("Failed to send email");
			throw "Failed to send email";
		}
		sails.log('Email sent!');
		return exits.success();
	}

};