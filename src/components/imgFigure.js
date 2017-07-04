import React from 'react';

class ImgFigure extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    //通过rearrange对象的isCenter判断此时被点击图片(index)是否居中
    if(this.props.rearrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let styleObj = {};
    if(this.props.rearrange.pos){
      styleObj= this.props.rearrange.pos;
    }
    if(this.props.rearrange.isCenter){
      styleObj.zIndex = 11;
    }

    if(this.props.rearrange.rotate){
      //兼容浏览器
      (['msTransform','MozTransform','WebkitTransform','transform']).forEach((value)=>{
        styleObj[value] = 'rotate('+this.props.rearrange.rotate+'deg)';
      })
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.rearrange.isInverse ? ' is-inverse' :'';


    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title"> {this.props.data.title}</h2>
          <div className="img-desc" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>

      </figure>
    )
  }
}

export default ImgFigure;
