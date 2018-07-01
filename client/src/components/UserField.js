import React, {Component} from 'react';

// class PhotoField extends Component{
export default ({input, label, type, name, value, meta : {touched, error}}) => {
  const labelElem = <label>{label}</label>;

  return <div className="form-group">
            {labelElem}
            <input
              type = {type}
              {...input}
              name = {name}
              className = "form-control"
              />
            {touched && error}
          </div>;


}
