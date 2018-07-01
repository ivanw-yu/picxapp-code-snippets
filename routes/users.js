var router = require('express').Router();
var User = require('../models/user');
var _ = require('lodash');
var {authenticate} = require('../middlewares/authenticate.js');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

const profilePicturesFolder = __dirname + "/../client/public/profilePictures/";

router.get('/', async (req, res) => {
  const query = req.query;
  try{
    const result = await User.findByKeywords( query.keywords || '',
                                              query.page || 1);
    res.send({success: true, users: result.users, count: result.count});
  }catch(e){
    res.status(404).send({success: false});
  }
});

router.get('/:id', async (req, res) => {
  try{
    const result = await User.findById(req.params.id);
    res.send({success: true, user: result});
  }catch(e){
    res.status(404).send({success: false});
  }
});

router.post('/', async (req, res) => {
  try{
    const user = new User(_.pick(req.body, ['name', 'username', 'email', 'password']));
    const savedUser = await user.save();
    res.send({success: true, user: savedUser});
  }catch(e){
    res.status(400).send({success: false, message: e.message});
  }
});

router.post('/login', async (req, res) => {
  try{
    const user = _.pick(req.body, ['emailOrUsername', 'password']);
    const foundUser = await User.findCredentials(user.emailOrUsername, user.password);
    const access = 'auth';
    const token = jwt.sign({_id: foundUser._id, access}, 'secrkey12').toString();
    res.send({success: true, user: foundUser, token});
  }catch(error){
    res.status(400).send({success: false, message: 'Invalid email/username and password combination.'});
  }
});

router.patch('/:id/profilePicture', authenticate, async (req, res) => {
  const user = req.user;
  const imageData = req.body.image,
        file = req.body.file,
        fileArr = file.split("."),
        fileExtension = fileArr[fileArr.length - 1];

  const completeFileName = user._id + '.' + fileExtension,
        completeFilePath = profilePicturesFolder + completeFileName;

  try{

    const foundUser = await User.findById(user._id);

    // if a profilePicture is found, delete it.
    if(foundUser.profilePicture){
      fs.unlinkSync(profilePicturesFolder + foundUser.profilePicture);
    }

    var data = imageData.replace(/^data:image\/\w+;base64,/, "");
    var buffer = new Buffer(data, 'base64');
    fs.writeFile(completeFilePath, buffer, async (err) => {
      if(err)
        res.status(500).send({success: false, message: 'Error updating profile picture.'});

      try{
        const updatedUser = await User.findByIdAndUpdate(user._id, {$set: {profilePicture: completeFileName} }, {new: true});
        res.send({success: true, user: updatedUser});
      }catch(e){
        res.status(500).send({success: false, message: 'Error updating profile picture.'});
      }
    });

  }catch(e){
    res.status(500).send({success: false, message: 'Error updating profile picture.'});
  }
});

router.delete('/:id/profilePicture', authenticate, async (req, res) => {
  try{
    const user = req.user;
    const profilePicture = user.profilePicture;

    if(profilePicture){
      fs.unlinkSync(profilePicturesFolder + profilePicture);
      const updatedUser = await User.findByIdAndUpdate(user._id, {$set: {profilePicture: null}}, {new: true});
      res.send({success: true, user: updatedUser});
    }

    res.status(404).send({success: false, message: 'Error: user does not have a profile picture to delete.'});
  }catch(e){
    res.status(400).send({success: false, message: 'Error deleting profile picture.'})
  }
});

router.patch('/:id/password', authenticate, async (req, res) =>{
  try{
    if(!req.body.newPassword || req.body.newPassword.length < 3){
      return res.status(400).send({success: false, message: 'Please make sure your new password is at least 3 characters long.'});
    }
    const foundUser = await User.findCredentials(req.user.username, req.body.password);
    if(!foundUser){
      return res.status(401).send({success: false, message: 'Incorrect password.'});
    }
    foundUser.password = req.body.newPassword;
    const newUser = await foundUser.save();
    res.send({success: true, user: newUser});
  }catch(e){
    res.status(500).send({success: false, message: 'Error occurred in saving new password.'});
  }
});

router.patch('/:id', authenticate, async (req, res) => {
  try{
    const user = _.pick(req.body, ['name', 'username', 'email', 'password']);
    const result = await User.findByIdAndUpdate(req.params.id, {$set : user}, {new: true});
    res.send({success: true, user: result});
  }catch(e){
    res.status(400).send({success: false, error: e.message});
  }
});


module.exports = router;
