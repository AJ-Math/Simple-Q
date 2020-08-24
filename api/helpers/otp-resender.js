module.exports = {


	friendlyName: 'Otp resender',


	description: 'To resend the OTP',


	inputs: {
		email: {
			friendlyName: 'Email',
			description: 'Email to resend OTP',
			type: 'string'
		},
	},


	fn: async function (inputs, exits) {
		sails.log("Resending OTP...");
		var email = inputs.email;
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

		// Fetching email and otp
		var query = `select o.otp, o.otpCount, o.userId, date(o.createdAt) as createdAt from users as u
			join otp as o on u.id = o.userId where u.email = $1`;
		var data = await sails.sendNativeQuery(query, [email])
			.catch(function(err) {
				sails.log.error("Failed to get user. Error: ", err);
				throw "Failed to get user";
			});

		if(!data || !data.rows || data.rows.length === 0) {
			sails.log.error(`User '${email}' doesn't exist. Aborting...`);
			throw "User doesn't exist";
		}
		// Check data: verify otp resend is not the 4th today
		var otpData = data.rows[0];
		var createdDate = new Date(otpData.createdAt);
		var todaysDate = new Date();

		if(createdDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0) && otpData.otpCount > 2) {
			// More than 2 OTPs sent to the user today.
			sails.log.warn(`User '${email}' has sent more than 2 OTPs today. Aborting...`);
			throw "User has sent more than 2 OTPs today";
		}

		// Resending OTP email
		await sails.helpers.emailSender({
			recipient: email,
			message: `OTP for queueing is <b>${otpData.otp}</b>.`,
			subject: "Simple-Q OTP"
		}).catch(function(err) {
			sails.log.error("Email sending failed. Error: ", err);
			throw "Email sending failed";
		});

		// Update otp count
		await Otp
			.updateOne({ userId: otpData.userId })
			.set({ otpCount: otpData.otpCount += 1 })
			.catch(function(err) {
				sails.log.error("Failed to update otp count. Error: ", err);
				throw "Failed to update otp count";
			});

		return exits.success(otpData.otpCount++);
	},

};

