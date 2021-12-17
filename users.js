
  
  function validate(username, password) {
    return users.some(user => user.username === username && user.password === password);
    
    
  }
  exports.validate = validate;