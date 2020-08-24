const crypto = require('crypto');

module.exports = {


	friendlyName: 'Update Admin',


	description: 'Updating admin data',


	inputs: {
		data: {
			friendlyName: 'Data',
			description: 'Data needed for updation',
			type: 'ref'
		},
	},


	fn: async function (inputs, exits) {
		sails.log("Helper updating admin...");
		var data = inputs.data;
		var name = '';

		switch(data.setting) {
			case 'uname':
				name = 'Admin.Username';
				break;

			case 'pass':
				if(!data.preValue) {
					sails.log.error("Current password absent. Aborting...");
					throw "Current password absent";
				}
				name = 'Admin.Pass';
				break;

			default:
				sails.log.error("Invalid setting");
				throw "Invalid setting";
				break;
		}

		if(data.setting === 'pass') {
			// Checking if current password is correct
			var currentPass = crypto.createHash('md5').update(data.preValue).digest("hex");
			var adminPass = await sails.helpers.getConfigValue('Admin.Pass').catch(function(err) {
				sails.log.error("Failed to get pass. ", err);
				throw "Failed to get pass";
			});

			if(currentPass !== adminPass) {
				sails.log.error("Old password incorrect");
				throw "Old password incorrect";
			}
			// Encrypting new password
			data.value = crypto.createHash('md5').update(data.value).digest("hex");
		}
		await Config
			.updateOne({ name: name })
			.set({ value: data.value })
			.catch(function(err) {
				sails.log.error("Failed to update admin. Error: ", err);
				throw "Failed to update admin";
			});
		sails.log("Admin updated. Setting: " + data.setting);
		return exits.success(data.value);
	}

};