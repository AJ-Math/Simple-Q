const crypto = require('crypto');

module.exports = {


	friendlyName: 'Admin Login',


	description: 'Login for admin',


	inputs: {
		data: {
			friendlyName: 'Data',
			description: 'Data needed for login',
			type: 'ref'
		},
	},


	fn: async function (inputs, exits) {
		sails.log("Logging in...");
		var data = inputs.data;

		// Check admin pass
		var admin = await Config.find({
			select: ['value', 'name'],
			where: { name: ['Admin.Pass', 'Admin.Username'] }
		}).catch(function(err) {
			sails.log.error("Failed to get data. Error: ", err);
			throw "Failed to get data";
		});

		if(!admin || admin.length === 0) {
			sails.log.error("Failed to get data");
			throw "Failed to get data";
		}
		var auth = {};

		admin.forEach(element=> {
			if(element.name === 'Admin.Username') {
				auth.uname = element.value;
			} else if(element.name === 'Admin.Pass') {
				auth.pass = element.value;
			}
		});
		var generatedCheckSum = crypto.createHash('md5').update(data.pass).digest("hex");

		if(generatedCheckSum !== auth.pass || auth.uname !== data.uname) {
			sails.log.error("Invalid details for login");
			throw "Invalid details for login";
		}

		sails.log('Successful login');
		return exits.success(auth.uname);
	}

};