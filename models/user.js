var mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var userSchema = new Schema({
    name: {first: {type: String, required: true},
           last: {type: String, required: true}},
    email: {type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: {validator: validator.isEmail,
                       message: `{VALUE} is not an email`}
            },
    username: { type: String,
                lowercase: true,
                unique: true,
                required: true
    },
    password: {type: String,
               required: true,
               minlength: 3},
    profilePicture : {type: String},
    tokens: [{
      access: {type: String, required: true},
      token: {type: String, required: true}
    }]
  },
  {runSettersOnQuery: true});

userSchema.pre('save', function(next){
  var user = this;
  user.name.first = _.startCase(user.name.first);
  user.name.last = _.startCase(user.name.last);
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
});

userSchema.methods.generateAuthToken = async function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id, access}, 'secrkey12').toString();
  user.tokens.push({token, access});
  const result = await user.save().catch(e => e);
  return {token, user};
}

userSchema.methods.removeToken = async function(token){
    var user = this;
    if(!token){
      throw new Error(400);
    }

    return user.update({$pull:
                          {tokens: token}
                        });
}

function passwordMatch(password, actual, user){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, actual, (err,res) => {
      if(res){
        resolve(user);
      }else{
        reject();
      }
    });
  });
}

userSchema.statics.findCredentials = async function(emailOrUsername, password){
  var User = this;

  try{
    const user = await User.findOne({$or:
                                      [{email: emailOrUsername},
                                       {username: emailOrUsername}]
                                    });
    const result = await passwordMatch(password, user.password, user);
    return result;
  }catch(e){
    return Promise.reject();
  }
}

userSchema.statics.findByToken = async function(token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'secrkey12');
  } catch(e){
    throw new Error(400);
  }
  const result = await User.findOne({ '_id': decoded._id,
                        'tokens.token': token,
                        'tokens.access': 'auth'});
  return result;
}

userSchema.statics.findByKeywords = async function(keywords, page){
  const User = this,
        limit = 12,
        match = keywords && keywords.length
                          ? `.*(${keywords.trim().split(/[ ]+/).join('|')})+.*`
                          : '',
        regEx = new RegExp(match, "i");

  const query = {$or: [{username: regEx},
                       {'name.first': regEx},
                       {'name.last': regEx}
                      ]};

  const result = await User.findPaginated(query, page, limit);
  return result;
}

userSchema.statics.findPaginated = async function(query, page, entriesPerPage=12){
  const User = this,
        startIndex = (page-1) * entriesPerPage;
  const count = await User.find(query).count();
  const result = await User.find(query).sort({"_id": -1}).skip(startIndex).limit(entriesPerPage);

  console.log(result, "result.length", result.length);
  return {users: result, count};
}

userSchema.methods.toJSON = function(){
  var user = this;
  return _.pick(user, ['_id', 'username', 'email', 'name', 'profilePicture']);
}

var User = mongoose.model('User', userSchema);



module.exports = User;
