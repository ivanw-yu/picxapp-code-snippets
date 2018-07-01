import React, {Component} from 'react';
import {connect} from 'react-redux';

class FlashMessage extends Component{

  render(){
    return  this.props.flashMessage ? this.renderFlashMessage() : '';
  }

  renderFlashMessage(){
    return <div className = "flash-message-div">
              <div className = {this.props.flashMessage.success ? "success-message" : "error-message"}>
                {this.props.flashMessage.message}
              </div>
            </div>;
  }

}

function mapStateToProps(state){
  return {flashMessage: state.flashMessage};
}

export default connect(mapStateToProps)(FlashMessage);
