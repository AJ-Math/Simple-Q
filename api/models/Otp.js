// Otp model

module.exports = {

	attributes: {
		updatedAt: false,
		id: {
			type: 'number', autoIncrement: true
		},
		userId: {
			model: 'users'
		},
		otp: {
			type: 'string', required: true
		},
		verified: {
			type: 'string', defaultsTo: 'N', isIn: ['Y', 'N']
		},
		otpCount: {
			type: 'number', defaultsTo: 1
		},
		createdAt: {
			type: 'string', columnType: 'datetime', autoCreatedAt: true
		}
	},

};
