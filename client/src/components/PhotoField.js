import React, {Component} from 'react';

export default ({label, type, name, required}) => {

    const labelElem = <label>{label}</label>;
    const requiredElem = required ? <span style = {{color: 'red'}} >{'*'}</span> : '';
    switch(type){
      case 'textarea':
        return (
            <div className="form-group">
              {labelElem}
              {requiredElem}
              <textarea
                name={name}
                className="form-control"
              />
            </div>);
      case 'file':
        return (
            <div className = "form-group">
              {labelElem}
              {requiredElem}(jpg, jpeg or png file only)
              <input
                name={name}
                type={type}
                accept="image/*"
                onChange = {handleImageOnChange} />
              <span id = "preview"></span>
            </div>);
      case 'checkbox':
        return (
          <div className = "form-group">
            {labelElem}
            {requiredElem}
            <input
              name={name}
              type={type}
              defaultChecked={true}
              />
          </div>);
      default:
        return (
            <div className = "form-group">
              {labelElem}
              {requiredElem}
              <input
                className = "form-control"
                name={name}
                type={type}
                />
            </div>);
    }
}

function handleImageOnChange(event){
  var file = event.target.files[0];
  if(file){
    var fileReader = new FileReader();

    fileReader.onload = function(e){
      document.getElementById('preview').innerHTML = '<img src = "' + e.target.result
                                                   + '" style = "width: 100px; height: 100px" />';
    }

    fileReader.readAsDataURL(file);
  }else{
    console.log('unable to read file');
  }
}
