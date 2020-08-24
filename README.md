# simple-q

Simple Q is a web application used to queue users. A user would go to the website and enter his details. After verification of those details, the user is registered in the queue. The admin lcan check the users queued.


Prerequisite:

- Node.js, Sails.js, MySQL.


Steps:

- Clone the repository.
- Run 'npm install' to install all packages required.
- Email address and password needs to be updated in 'queries.sql' (Password should be encrypted as stated in that file).
- In 'config/custom.js', the mailer details need to be updated.
- An environment variable 'ENCKEY' needs to be set to store the password string used for encryption/decryption.


Things to Notice:

- Port 8080 is set for the development environment.
- Admin login page is '/admin'.
- Admin's default username and password are 'admin' and 'adminadmin' respectively.
- OTP resending timeout can be changed from 'assets/js/home.js'.
