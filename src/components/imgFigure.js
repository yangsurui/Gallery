import React from 'react';

class ImgFigure extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    //通过rearrange对象的isCenter判断此时被点击图片(index)是否居中
    if(this.props.rearrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
  }

  render() {
    let styleObj = {};
    if(this.props.rearrange.pos){
      styleObj= this.props.rearrange.pos;
    }
    if(this.props.rearrange.isCenter){
      styleObj.zIndex = 101;
    }

    if(this.props.rearrange.rotate){
      //兼容浏览器
      (['msTransform','MozTransform','WebkitTransform','transform']).forEach((value)=>{
        styleObj[value] = 'rotate('+this.props.rearrange.rotate+'deg)';
      })
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.rearrange.isInverse ? ' is-inverse' :'';

    let imgDesc = 'img-desc';
    imgDesc += this.props.rearrange.isInverse ? ' is-inverse' :'';

    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title"> {this.props.data.title}</h2>
          <div className={imgDesc} onClick={this.handleClick}>{this.props.data.desc}</div>
        </figcaption>

      </figure>
    )
  }
}

export default ImgFigure;
