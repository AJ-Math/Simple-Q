// Config model

module.exports = {

	attributes: {
		updatedAt: false,
		id: {
			type: 'number', autoIncrement: true
		},
		name: {
			type: 'string', required: true 
		},
		value: {
			type: 'string', required: true
		},
	},

};