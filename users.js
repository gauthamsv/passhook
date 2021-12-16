const users = [
    {
      username: 'michelletest@example.com',
      password: 'hunter2',
    },
    {
      username: 'jennifer.cleversy@example.com',
      password: 'password1',
    },
      {
      username: 'dave.williams@example.com',
      password: 'password2',
    },
  ]
  
  
  
  function validate(username, password) {
    return users.some(user => user.username === username && user.password === password);
    
    
  }
  exports.validate = validate;
  