const crypto = require('crypto');

module.exports = {


	friendlyName: 'Encrypter Decrypter',


	description: 'Provide encryption and decryption',


	inputs: {
		op: {
			friendlyName: 'Operation',
			description: 'Encrypt or decrypt',
			type: 'string'
		},
		data: {
			friendlyName: 'Data',
			description: 'Data string',
			type: 'string'
		},
	},


	fn: async function (inputs, exits) {
		sails.log("Preparing to encrypt or decrypt...");
		var iv = '';
		var algorithm = 'aes-256-cbc';
		var encKey = process.env.ENCKEY;

		if(inputs.op === 'encrypt') {
			// Encryption
			iv = crypto.randomBytes(16);
			// Getting encryption key from environment variable
			var cipher = crypto.createCipheriv(algorithm, Buffer.from(encKey), iv);
			var encrypted = cipher.update(inputs.data);

			encrypted = Buffer.concat([encrypted, cipher.final()]);
			var encString = iv.toString('hex') + ':' + encrypted.toString('hex');

			return exits.success(encString);
		} else if(inputs.op === 'decrypt') {
			// Decryption
			sails.log("Decrypting...");
			var textParts = inputs.data.split(':');

			iv = Buffer.from(textParts.shift(), 'hex');
			var encryptedText = Buffer.from(textParts.join(':'), 'hex');
			var decipher = crypto.createDecipheriv(algorithm, Buffer.from(encKey), iv);
			var decrypted = decipher.update(encryptedText);

			decrypted = Buffer.concat([decrypted, decipher.final()]);
			var decString = decrypted.toString();

			return exits.success(decString);
		} else {
			sails.log.error("Invalid operation " + inputs.op);
			throw "Invalid operation";
		}
	}

};