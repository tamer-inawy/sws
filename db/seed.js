const adminsService = require('../app/modules/admins/admins.service');

const adminData = {
  "name": "Init Admin",
  "email": "admin@sws.com",
  "password": "admin"
};

adminsService.create(adminData)
.then(results => {
  console.log('Init admin has been added!');
  console.log(results);
  process.exit();
})
.catch(err => {
  console.log('Can\'t add the admin', err);
  process.exit(1);
})
