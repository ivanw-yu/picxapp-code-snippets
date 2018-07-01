var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

var User = require('./user');

var photoSchema = new Schema({
  title: {type: String,
          required: true},
  caption: String,
  fileExtension: {type: String,
                  required: true},
  user: {type: ObjectId,
         ref: 'User'},
  publicity: {type: Boolean,
           default: true},
  comments: [{
    user: {type: ObjectId,
            ref: 'User'},
    comment: {type: String,
              required: true}
  }]
});

photoSchema.statics.findByKeyword = async function(keywords, page, publicity, lastId=null){
  const Photo = this,
        limit = 12;

  let query = {$and : [{publicity: true}]};

  if(keywords && keywords.length){
    const keywordsArray = keywords.trim().split(/[ ]+/);
    let searchQuery = {$or: []};
    keywordsArray.forEach( (keyword) => {
      searchQuery.$or.push({ $or: [
                              { title : new RegExp(".*" + keyword + ".*", "i") },
                              { caption : new RegExp(".*" + keyword + ".*", "i")}
                            ]
                          });
    });
    query.$and.push(searchQuery);
  }

  const result = await Photo.findPaginated(query, page, limit);
  return result;
}

photoSchema.statics.findByUserId = async function(user, page=1){
  const query = {user};
  const result = await Photo.findPaginated(query, page);
  return result;
}

photoSchema.statics.findPaginated = async function(query, page, entriesPerPage=12){
  const Photo = this,
        startIndex = (page-1) * entriesPerPage;
  const count = await Photo.find(query).count();
  const result = await Photo.find(query).sort({"_id": -1}).skip(startIndex).limit(entriesPerPage);

  return {photos: result, count};
}

var Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo;
