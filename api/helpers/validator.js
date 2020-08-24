module.exports = {


	friendlyName: 'Validator',


	description: 'Used to validate data',


	inputs: {
		data: {
			friendlyName: 'Data',
			description: 'Object with validation data',
			type: 'ref'
		},
	},


	fn: async function (inputs, exits) {
		sails.log("Validator starting...");
		var type = inputs.data.type;

		switch(type) {
			case 'email':
				sails.log("Validating email...");
				var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				return pattern.test(inputs.data.email) ? exits.success(true) : exits.success(false);
				break;

			case 'otp':
				sails.log("Validating otp...",inputs.data.otp);
				var otp = inputs.data.otp;

				return (isNaN(otp) || otp.length != 6) ? exits.success(false) : exits.success(true);
				break;
		}
	},

};

