import React from 'react';

class ControllerUnits extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(){
    if(this.props.rearrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
  }
  render(){
    let controllerUnitsClassName = 'controller-unit';
    controllerUnitsClassName += this.props.rearrange.isInverse ? ' controller-is-inverse' : '';
    return(
      <span className={controllerUnitsClassName} onClick={this.handleClick}></span>
    )
  }
}

export default ControllerUnits;
