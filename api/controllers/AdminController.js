module.exports = {

	viewDashboard: async function(req, res) {
		sails.log("Rendering admin dashboard...");
		// Getting queued users
		var resp = await sails.helpers.getUsers( {type: 'Q', print: true} ).catch(function(err) {
			sails.log.error("Failed to retrieve queued users. Error: ", err);
		});

		return res.view('pages/admin/dashboard', {
			layout: 'layouts/admin/commonLayout',
			data: JSON.stringify(resp.data),
			printData: resp.printData
		});
	},

	viewSettings: async function(req, res) {
		sails.log("Rendering admin settings...");
		var resp = await sails.helpers.getConfigValue('Admin.Username').catch(function(err) {
			sails.log.error("Failed to get config data. Error: ", err);
		});
		// Getting queued users
		return res.view('pages/admin/settings', {
			layout: 'layouts/admin/commonLayout',
			adminUname: resp
		});
	},

	viewconfigurations: async function(req, res) {
		sails.log("Rendering admin configurations...");
		return res.view('pages/admin/configure', {
			layout: 'layouts/admin/commonLayout',
			adminUname: resp
		});
	},

	updateSettings: async function(req, res) {
		sails.log("Updating admin settings...");
		var body = req.body;

		if(!body || !body.setting || !body.value) {
			sails.log.error("Body absent/invalid. ", body);
			return res.badRequest();
		}
		var resp = await sails.helpers.updateAdmin(body).catch(function(err) {
			sails.log.error("Admin updation failed");
		});
		
		return (resp) ? res.send({success: true, data: resp}) : res.send({success: false});
	},

	logout: async function(req, res) {
		sails.log("Logging out...");
		req.session.destroy();
		return res.send(true);
	},

};