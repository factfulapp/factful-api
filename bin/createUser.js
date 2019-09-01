const inquirer = require('inquirer');
const createUser = require('../api/domain/users/createUser');

console.log('Create New Admin User');

inquirer.prompt([
  {
    type: 'string',
    name: 'username',
    message: 'Enter a username:'
  },
  {
    type: 'password',
    name: 'password',
    mask: '*',
    message: 'Enter a password:'
  },
  {
    type: 'password',
    name: 'password2',
    mask: '*',
    message: 'Retype password:'
  },
  {
    type: 'string',
    name: 'name',
    message: 'What is your name?'
  }
])
  .then(function (answers) {
    return createUser.createUser(answers);
  })
  .then(function (response) {
    console.log(response);
    process.exit(0);
  })
  .catch(function (err) {
    if (err.name === 'UserCreationError') {
      switch (err.code) {
        case 'MISSING_USERNAME':
          console.log('Please provide a username.');
          break;
        case 'PASSWORDS_DONT_MATCH':
          console.log('The two passwords dont match!');
          break;
        case 'MISSING_PASSWORD':
          console.log('Password not provided');
          break;
        case 'MISSING_NAME':
          console.log('Name not provided');
          break;
      }
    } else {
      console.error(err);
    }
    process.exit(1);
  });
