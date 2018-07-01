var User = require('.././models/user.js');
var jwt =  require('jsonwebtoken');

var authenticate = async (req, res, next) => {
  var token = req.header('x-auth');
  let decoded;

  try{
    decoded = jwt.verify(token, 'secrkey12');
    const user = await User.findById(decoded._id);
    req.user = user;
    req.token = token;
    next();
  }catch(e){
    res.status(400).send({success: false, errorMessage: 'Unauthorized access.'});
  }
}

module.exports = {authenticate};
