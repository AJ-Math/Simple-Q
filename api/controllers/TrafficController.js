module.exports = {

	test: async function(req, res) {
		sails.log("testing...");
		console.log(req.session);
	},

	sendOtp: async function(req, res) {
		sails.log("Preparing to send OTP...");
		var body = req.body;

		if(!body || !body.name || !body.email) {
			sails.log.error("Body absent/invalid. ", body);
			return res.badRequest();
		}
		var resp = await sails.helpers.otpSender(body).catch(function(err) {
			sails.log.error("OTP sending failed");
		});
		
		return (resp) ? res.send({success: true}) : res.send({success: false});
	},

	resendOtp: async function(req, res) {
		sails.log("Preparing to resend OTP...");
		var body = req.body;

		if(!body || !body.email) {
			sails.log.error("Body absent/invalid. ", body);
			return res.badRequest();
		}
		var resp = await sails.helpers.otpResender(body.email).catch(function(err) {
			sails.log.error("OTP resending failed");
		});
		
		return (resp) ? res.send({success: true, otpCount: resp}) : res.send({success: false});
	},

	verifyOtp: async function(req, res) {
		sails.log("Preparing to verify OTP...");
		var body = req.body;

		if(!body || !body.email || !body.otp) {
			sails.log.error("Body absent/invalid. ", body);
			return res.badRequest();
		}
		var resp = await sails.helpers.otpVerifier(body).catch(function(err) {
			sails.log.error("OTP verification failed");
		});
		
		return (resp) ? res.send({success: true}) : res.send({success: false});
	},

	adminLogin: async function(req, res) {
		sails.log("Preparing to login...");
		var body = req.body;

		if(!body || !body.uname || !body.pass) {
			sails.log.error("Body absent/invalid. ", body);
			return res.badRequest();
		}
		var resp = await sails.helpers.adminLogin(body).catch(function(err) {
			sails.log.error("Admin login failed");
		});

		if(resp) {
			req.session.userId = sails.config.custom.adminId; // Admin user ID
			req.session.userName = resp; // Admin username
		}
		return (resp) ? res.send({success: true}) : res.send({success: false});
	},

};