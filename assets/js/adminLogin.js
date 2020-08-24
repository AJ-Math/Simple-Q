var app = new Vue({

	el: '#app',
	vuetify: new Vuetify(),

	data: {
		adminForm: false,
		adminError: false,
		loginLoading: false,
		uname: '',
		pass: '',
		rules: {
			uname: [
				v => !!v || 'Username is required',
				v => (v.length > 2) || 'Username must be valid',
			],
			pass: [
				v => !!v || 'Password is required',
				v => (v.length > 7) || 'Password should atleast have 8 letters',
			]
		}
	},

	methods: {
		login: function() {
			console.log("Logging in...");
			this.loginLoading = true;
			this.adminError = false;
			var vm = this;

			axios({
				method: 'post',
				url: '/adminLogin',
				data: {
					uname: this.uname,
					pass: this.pass
				}
			}).then(function (response) {
				console.log(response.data);
				vm.loginLoading = false;
				if(!response.data.success) {
					vm.loginLoading = false;
					vm.adminError = true;
				} else {
					console.log("Login success");
					window.location.href = "/admin/dashboard";
				}
			}).catch(function (error) {
				// handle error
				console.log(error);
				vm.loginLoading = false;
				vm.adminError = true;
			});
		}
	},
});