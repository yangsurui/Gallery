import React from 'react';

class ControllerUnits extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    if(this.props.rearrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }
  render(){
    let controllerUnitsClassName = 'controller-unit';
    if(this.props.rearrange.isCenter){
      controllerUnitsClassName += ' controller-is-center';
      if(this.props.rearrange.isInverse){
        controllerUnitsClassName += ' controller-is-inverse';
      }
    }
    return(
      <span className={controllerUnitsClassName} onClick={this.handleClick}></span>
    )
  }
}

export default ControllerUnits;
