// Users model

module.exports = {

	attributes: {
		updatedAt: false,
		id: {
			type: 'number', autoIncrement: true
		},
		name: {
			type: 'string', required: true 
		},
		email: {
			type: 'string', required: true
		},
		queued: {
			type: 'string', defaultsTo: 'N', isIn: ['Y', 'N']
		},
		uniqueId: {
			type: 'string'
		},
		flag: {
			type: 'number', defaultsTo: 0
		},
		createdAt: {
			type: 'string', columnType: 'datetime', autoCreatedAt: true
		},
		otp: {
			collection: 'otp',
			via: 'userId'
		}
	},

};