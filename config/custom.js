/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  mailer: {
  	host: 'smtp.mailtrap.io',
  	from: 'noreply@example.com',
    port: 2525
  },
  otpGen: "Math.floor(100000 + Math.random() * 900000)",
  adminId: 0,

};
