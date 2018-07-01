import React, {Component} from 'react';

class User extends Component{

  constructor(props){
    super(props);
  }

  render(){
      return <div className = "row user-info">
                {this.renderProfilePicture()}
                <div style = {{float: 'left'}} >
                  <p>Name: {`${this.props.user.name.first} ${this.props.user.name.last}`}</p>
                  <p>Username: {this.props.user.username}</p>
                </div>
            </div>;
  }

  renderProfilePicture(){
    return this.props.user.profilePicture ?
                <img src = {`/profilePictures/${this.props.user.profilePicture}`}
                     className = "profile-picture"
                     style = {{float: 'left'}}
                 />
              :
                <span className = "glyphicon glyphicon-user profile-picture"
                      style = {{float: 'left'}}
                />;
  }

}

export default User;
