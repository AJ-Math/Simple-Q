module.exports = {


	friendlyName: 'Get config value',


	description: 'To get value from name in config table',


	inputs: {
		name: {
			friendlyName: 'Name',
			description: 'Name of the config record',
			type: 'string'
		},
	},


	fn: async function (inputs, exits) {
		sails.log("Getting config value...");
		var result = await Config.findOne({
			select: ['value'],
			where: { name: inputs.name }
		}).catch(function(err) {
			sails.log.error("Failed to get config data. Error: ", err);
			throw "Failed to get config data";
		});

		return exits.success(result.value);
	},

};

