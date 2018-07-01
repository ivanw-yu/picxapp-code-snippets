var router = require('express').Router();
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

var Photo = require('../models/photo');
var {authenticate} = require('../middlewares/authenticate');


const photoFolder = __dirname + "/../client/public/photos/";

router.get('/', async (req,res) => {
  let keywords, page;
  const params = req.query;
  if(params){
    keywords = params.keywords;
    page = params.page;
  }else{
    keywords = null;
    page = 1;
  }

  try{
    const result = await Photo.findByKeyword(keywords, page, true);
    if(result.count > 0)
      return res.send({success: true, photos: result.photos, count: result.count});

    // if the initial result doesn't return anything, return all the photos paginated, with message
    const allPhotos = await Photo.findByKeyword('', page, true);
    const message = `No results found for '${keywords}', but here are some photos: `;
    res.send({success: true, photos: allPhotos.photos, count: allPhotos.count, message});
  }catch(e){
    res.status(500).send({success: false});
  }

});

router.get('/:id', async (req, res) => {
  const _id = req.params.id;
  try{
    const photo = await Photo.findById(_id).populate('user').populate('comments.user');//.exec();
    res.send({success: true, photo});
  }catch(e){
    res.status(500).send({success: false});
  }
});

// the photo will be saved as ObjectId.file_extension on the server.
router.post('/', authenticate, (req, res) => {
  var imageData = req.body.image;

  var photo = new Photo(_.pick(req.body, ['user','title', 'caption', 'public', 'fileExtension']));

  if(!/(jpe?g|png)$/i.test(photo.fileExtension)){
    return res.status(400).send({success: false, message: 'Error: Unable to save photo, please use valid file extensions only (jpeg, jpg or png)'});
  }

  photo.save().then((photo) => {
    const completeFilePath = photoFolder + photo._id + '.' + photo.fileExtension;
    var data = imageData.replace(/^data:image\/\w+;base64,/, "");
    var buffer = new Buffer(data, 'base64');

    fs.writeFile(completeFilePath, buffer, function(err){

      if(err){
        return Photo.findByIdAndRemove(photo._id).then((photo) => {
          return res.status(500).send({success: false, message: 'Error: Unable to save file.'});
        }).catch((e) => {
          return res.status(500).send({success: false, message: 'Error: Unable to save file.'});
        });
      }

      res.send({success: true, photo});
    });
  }).catch((e) =>{
    res.status(500).send({success: false});
  });
});

router.get('/user/:id', async (req, res) => {
  const page = req.query ? (req.query.page ? req.query.page : 1) : 1;
  const user = req.params.id;

  try{
    const result = await Photo.findByUserId(user, page);
    res.send({success: true, photos: result.photos, count: result.count});
  }catch(e){
    res.status(500).send({success: false});
  }
});

router.post('/:id/comments', authenticate, async (req, res) => {
  const comment = _.pick(req.body, ['user', 'comment']);
  try{
    const photo = await Photo.findByIdAndUpdate(req.params.id, {$push : { comments: comment } }, {new: true})
                             .populate('user')
                             .populate('comments.user');
    res.send({success: true, photo: photo});
  }catch(e){
    res.status(500).send({success: false, message: 'Error occurred in posting comment.'});
  }
});

router.delete('/:photoId/comments/:commentId', authenticate, async (req, res) => {
  try{
    const photo  = await Photo.findByIdAndUpdate(req.params.photoId, {$pull : {comments: {_id : req.params.commentId}}}, {new: true})
                              .populate('user')
                              .populate('comments.user');
    res.send({success: true, photo});
  }catch(e){
    res.status(500).send({success: false});
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try{
    const _id = req.params.id;
    const deletedPhoto = await Photo.findByIdAndRemove(_id);
    fs.unlinkSync(photoFolder + deletedPhoto._id + '.' + deletedPhoto.fileExtension);
    res.send({success: true, photo: deletedPhoto});
  }catch(e){
    res.status(400).send({success:false, message: 'Error deleting photo.'});
  }
});

module.exports = router;
