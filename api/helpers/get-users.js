module.exports = {


	friendlyName: 'Get users',


	description: 'To get users',


	inputs: {
		data: {
			friendlyName: 'Data',
			description: 'Object with data to get type of users',
			type: 'ref'
		},
	},


	fn: async function (inputs, exits) {
		sails.log("Getting users from helper...");
		var query = '';
		var uniqueId = '';

		if(!inputs.data.type) {
			sails.log.error("Invalid type " + inputs.data.type);
			throw "Invalid type";
		}
		switch(inputs.data.type) {
			case 'Q':
				sails.log("Getting queued users...");
				query = `select id as queuePosition, name, email, uniqueId,
					DATE_FORMAT(createdAt, "%e %b %Y, %l:%i %p") as date from users where queued = 'Y'`;
				break;
		}

		var data = await sails.sendNativeQuery(query)
			.catch(function(err) {
				sails.log.error("Failed to get users. Error: ", err);
				throw "Failed to get users";
			});

		if(!data || !data.rows) {
			sails.log.error("No data found");
			throw "No data found";
		}
		if(inputs.data.print) {
			sails.log("Preparing print html...");
			var styles = `table, td, th {border: 1px solid black; text-align: center;}
				table {border-collapse: collapse;} `;
			var html = `<html><head><title>Simple Q Users</title></head>
				<style>${styles}</style><body><div><table><tr>
				<th>Queue Position</th><th>Unique ID</th><th>Name</th><th>Email</th>
				<th>Date & Time</th></tr>`;

			data.rows.forEach(element=> {
				uniqueId = element.uniqueId ? element.uniqueId : 'NA';
				html += `<tr><td>${element.queuePosition}</td><td>${uniqueId}</td>
					<td>${element.name}</td><td>${element.email}</td><td>${element.date}</td></tr>`;
			});
			html += "</table></div></body></html>";
		}
		return exits.success({
			data: data.rows,
			printData: html
		});
	},

};

