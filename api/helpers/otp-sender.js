module.exports = {


	friendlyName: 'Otp sender',


	description: 'To send initial OTP to first time user',


	inputs: {
		data: {
			friendlyName: 'Data',
			description: 'Object with data to send OTP',
			type: 'ref'
		},
	},


	fn: async function (inputs, exits) {
		sails.log("Sending OTP...");
		var email = inputs.data.email;
		// Validating email
		var validEmail = await sails.helpers.validator({
			type: 'email',
			email: email
		}).catch(function(err) {
			sails.log.error("Failed to validate. Error: ", err);
			throw "Failed Failed to validate";
		});

		if(!validEmail) {
			sails.log.error("Invalid email");
			throw "Invalid email";
		}

		// Checking if email exist
		var userCount = await Users.count({
			email: email
		}).catch(function(err) {
			sails.log.error("Failed to get count of users. Error: ", err);
			throw "Failed to get count of users";
		});

		if(userCount > 0) {
			sails.log.warn(`User '${email}' is already present. Aborting...`);
			throw "User already exist";
		}
		// Sending email
		var otp = eval(sails.config.custom.otpGen);

		await sails.helpers.emailSender({
			recipient: email,
			message: `OTP for queueing is <b>${otp}</b>.`,
			subject: "Simple-Q OTP"
		}).catch(function(err) {
			sails.log.error("Email sending failed. Error: ", err);
			throw "Email sending failed";
		});

		// Populate 'users' and 'otp' tables
		var user = await Users.create({
			name: inputs.data.name,
			email: email,
			queued: 'N'
		}).fetch().catch(function(err) {
			sails.log.error("Failed to create user. Error: ", err);
			throw "Failed to create user";
		});

		if(!user || user.length === 0) {
			sails.log.error("Failed to create user.");
			throw "Failed to create user";
		}
		await Otp.create({
			userId: user.id,
			otp: otp,
			verified: 'N',
			otpCount: 1
		}).catch(function(err) {
			sails.log.error("Failed to create otp. Error: ", err);
			throw "Failed to create otp";
		});
		sails.log('Records created! Otp process completed');
		return exits.success(true);
	},

};

