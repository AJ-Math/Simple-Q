const { v4: uuidv4 } = require('uuid');

module.exports = {


	friendlyName: 'Otp verifier',


	description: 'To verify the OTP',


	inputs: {
		data: {
			friendlyName: 'Data',
			description: 'Data object to verify OTP',
			type: 'ref'
		},
	},


	fn: async function (inputs, exits) {
		sails.log("Verifying OTP...");
		var email = inputs.data.email;
		var otp = inputs.data.otp;

		// Validating email and otp
		var validEmail = sails.helpers.validator({
			type: 'email',
			email: email
		});
		var validOtp = sails.helpers.validator({
			type: 'otp',
			otp: otp
		});
		var prArr = await Promise.all([validEmail, validOtp]).catch(function(err) {
			sails.log.error("Failed to validate. Error: ", err);
			throw "Failed to validate";
		});

		if(!prArr || !prArr[0] || !prArr[1]) {
			sails.log.error("Invalid email/otp");
			throw "Invalid email/otp";
		}

		// Check if otp match email in db
		var query = `select o.userId, u.name from otp as o join users as u on u.id = o.userId where
			u.email = $1 and o.otp = $2`;
		var params = [email, otp];
		var result = await sails.sendNativeQuery(query, params).catch(function(err) {
			sails.log.error("Failed to get data. Error: ", err);
			throw "Failed to get data";
		});

		if(!result || !result.rows || result.rows.length === 0) {
			sails.log.error("Failed to get data. Aborting...");
			throw "Failed to get data";
		}
		var userId = result.rows[0].userId;

		// Verify otp in 'otp' table
		await Otp
			.updateOne({ userId: userId })
			.set({ verified: 'Y' })
			.catch(function(err) {
				sails.log.error("Failed to update otp verification. Error: ", err);
				throw "Failed to update otp verification";
			});

		// Queue user in 'users' table and assign unique ID
		var uid = uuidv4();

		await Users
			.updateOne({ id: userId })
			.set({ queued: 'Y', uniqueId: uid })
			.catch(function(err) {
				sails.log.error("Failed to update user. Error: ", err);
				throw "Failed to update user";
			});
		sails.log("Successfully verified OTP and updated");

		// Send user an email
		await sails.helpers.emailSender({
			recipient: email,
			message: `Hooray! You're now queued in Simple-Q.<br><br><b>Unique ID: ${uid}</b>.
				<br>Name: ${result.rows[0].name}.
				<br>Email: ${email}.`,
			subject: "Simple-Q Registered"
		}).catch(function(err) {
			sails.log.error("Email sending failed. Error: ", err);
			throw "Email sending failed";
		});

		return exits.success(true);
	},

};

