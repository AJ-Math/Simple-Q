var app = new Vue({

	el: '#app',
	vuetify: new Vuetify(),

	data: {
		rules: {
			uname: [
				v => !!v || 'Username is required',
				v => (v.length > 2) || 'Username should atleast have 3 letters',
			],
			pass: [
				v => !!v || 'Password is required',
				v => (v.length > 7) || 'Password should atleast have 8 letters',
			],
		},
		drawer: false,
		group: 0,
		search: '',
		headers: [
			{
				text: 'Queue Position',
				align: 'start',
				value: 'queuePosition',
			},
			{ text: 'Unique ID', value: 'uniqueId' },
			{ text: 'Name', value: 'name' },
			{ text: 'Email', value: 'email' },
			{ text: 'Date & Time', value: 'date' }
		],
		sortBy: 'queuePosition',

		uname: '',
		unameForm: false,
		unameSuccess: false,
		unameError: false,
		unameLoading: false,

		cpass: '',
		npass: '',
		rnpass: '',
		passForm: false,
		passSuccess: false,
		passError: false,
		passLoading: false,
	},

	methods: {
		logout: function() {
			console.log("Logging out...");
			this.adminError = false;
			var vm = this;

			axios({
				method: 'post',
				url: '/adminLogout'
			}).then(function (response) {
				console.log(response.data);
				if(!response.data) {
					console.log("Logout failed");
				} else {
					window.location.href = "/admin";
				}
			}).catch(function (error) {
				// handle error
				console.log(error);
			});
		},
		print: function() {
			console.log("Printing...");
			var printWindow = window.open('');

			printWindow.document.write(printData);
			printWindow.document.close();
			printWindow.print();
			printWindow.close();
		},

		updateUname: function() {
			console.log("Updating username...");
			this.unameError = false;
			this.unameSuccess = false;
			var vm = this;

			axios({
				method: 'post',
				url: '/admin/updateSettings',
				data: {
					setting: 'uname',
					value: this.uname
				}
			}).then(function (response) {
				console.log(response.data);
				if(!response.data || !response.data.success) {
					console.log("Update failed");
					vm.unameError = true;
				} else {
					vm.unameSuccess = true;
					document.getElementById('uname').innerHTML = response.data.data;
				}
			}).catch(function (error) {
				// handle error
				console.log(error);
				vm.unameError = true;
			});
		},
		updatePass: function() {
			console.log("Updating password...");
			this.passError = false;
			this.passSuccess = false;
			var vm = this;

			axios({
				method: 'post',
				url: '/admin/updateSettings',
				data: {
					setting: 'pass',
					value: this.npass,
					preValue: this.cpass
				}
			}).then(function (response) {
				console.log(response.data);
				if(!response.data || !response.data.success) {
					console.log("Update failed");
					vm.passError = true;
				} else {
					vm.passSuccess = true;
				}
			}).catch(function (error) {
				// handle error
				console.log(error);
				vm.passError = true;
			});
		},
	},

	watch: {
		group () {
			this.drawer = false
		},
	},

	mounted: function () {
		var vm = this;

		this.$nextTick(function () {
			// Code that will run only after the entire view has been rendered

			// Navigation menu selection
			var path = window.location.pathname;

			switch(path) {
				case '/admin/dashboard':
					vm.group = 0;
					break;

				case '/admin/settings':
					vm.group = 1;
					break;

				default: break;
			}
			// Password mismatch check
			this.rules.rpass = [
				v => !!v || 'Password is required',
				v => (this.npass == v) || 'Passwords mismatch',
			];
		});
	},

});