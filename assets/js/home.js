var app = new Vue({

	el: '#app',
	vuetify: new Vuetify(),

	data: {
		homePage: true,
		homeForm: false,
		homeLoading: false,
		homeError: false,

		otpPage: false,
		otpForm: false,
		otpLoading: false,
		otpErrorMsg: '',
		resendLoader: false,
		resendDisabled: false,
		otpError: false,
		otpInfo: false,

		endPage: false,
		emailPattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		rules: {
			email: [
				v => !!v || 'E-mail is required',
				v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid',
			],
			fname: [
				v => !!v || 'Name is required',
				v => (v.length > 2) || 'Name should atleast have 3 letters',
			],
			otp: [
				v => !!v || 'OTP is required',
				v => (v.length > 5) || 'Enter valid OTP',
			],
		},
		fname: '',
		email: '',
		homeDialog: false,
		otpDialog: true,
		otp: '',
		timer: 120,
		timer2: 120,
	},

	methods: {
		sendOtp: function() {
			console.log('Sending OTP...');
			this.homeLoading = true;
			this.homeError = false;
			var vm = this;

			axios({
				method: 'post',
				url: '/sendOtp',
				data: {
					name: this.fname,
					email: this.email
				}
			}).then(function (response) {
				console.log(response.data);
				vm.homeLoading = false;
				if(!response.data.success) {
					vm.homeError = true;
				} else {
					vm.homePage = false;
					vm.otpPage = true;
					vm.startTimer();
				}
			}).catch(function (error) {
				// handle error
				console.log(error);
				vm.homeLoading = false;
				vm.homeError = true;
			});
		},
		startTimer: function() {
			console.log('Starting timer...');
			setInterval(() => {
				if(this.timer >= 1){
					this.timer--;
				}
			}, 1000);
		},
		resendOtp: function() {
			console.log('Resending OTP...');
			// Disable 'resend otp' link
			this.resendLoader = true;
			this.hideOtpAlerts();
			this.otpErrorMsg = 'Failed to resend OTP';
			var vm = this;

			axios({
				method: 'post',
				url: '/resendOtp',
				data: {
					email: this.email
				}
			}).then(function (response) {
				console.log(response);

				vm.resendLoader = false; // Stop spinning reload
				vm.timer = vm.timer2; //Restoring timer with it's initial value
				var data = response.data;

				if(!data.success) {
					vm.otpError = true;
					vm.startTimer();
				} else {
					// Restart timer if otpcount < 3 and show sent
					vm.otpInfo = true;
					if(data.otpCount && data.otpcount < 3){
						vm.startTimer();
					}
				}
			}).catch(function (error) {
				// handle error
				console.log(error);
				vm.otpError = true;
				vm.startTimer();
			});
		},
		verifyOtp: function() {
			console.log('Verifying OTP...');
			this.otpLoading = true;
			this.hideOtpAlerts();
			this.otpErrorMsg = 'Failed to verify OTP.';
			var vm = this;

			axios({
				method: 'post',
				url: '/verifyOtp',
				data: {
					email: this.email,
					otp: this.otp
				}
			}).then(function (response) {
				console.log(response);
				var data = response.data;

				if(!data.success) {
					vm.otpError = true;
				} else {
					vm.showEndPage();
				}
			}).catch(function (error) {
				// handle error
				console.log(error);
				vm.otpError = true;
			});
		},
		hideOtpAlerts: function() {
			this.otpError = false;
			this.otpInfo = false;
		},
		showEndPage: function() {
			this.homePage = false;
			this.otpPage = false;
			this.endPage = true;
		},
	},

});