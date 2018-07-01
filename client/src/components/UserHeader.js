import React, {Component} from 'react';
/* this.props.user should be passed down from parent component */
class UserHeader extends Component{
    render(){
        return this.props.user ? (
            <div className = "row profile-header-area">
            <div className = "col-sm-3">
              {this.renderProfilePicture()}
             </div>
                <div className = "col-sm-8 profile-header">
                  <h1>{this.props.user.name ? `${this.props.user.name.first} ${this.props.user.name.last} (${this.props.user.username})`
                                            : ''}</h1>
                </div>
            </div>
        ) : "";
    }

    renderProfilePicture(){
      return <div>
                { this.props.user.profilePicture ?
                    <img src = {`/profilePictures/${this.props.user.profilePicture}`}
                         className = "profile-picture"
                     />
                    :
                    <span className = "glyphicon glyphicon-user profile-picture"
                          style = {{float: 'left'}}
                    />
                 }
            </div>
    }
}

export default UserHeader;
