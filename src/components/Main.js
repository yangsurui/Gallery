require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let imgData = require('../data/imgDatas.json');

//利用自执行函数，将图片名称信息转成图片url路径信息
(imgDataArr =>{
  for(let i=0,len= imgDataArr.length;i<len;i++){
    let imgDataArrItem = imgDataArr[i];
    imgDataArrItem.imgUrl = require('../images/'+imgDataArrItem.filename);
    imgDataArr[i] = imgDataArrItem;
  }
  return imgDataArr;
})(imgData);

class ImgFigure extends React.Component {
  render() {
    return(
      <figure className="">
        <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
        <figcaption>
          {this.props.data.title}
        </figcaption>
      </figure>
    )
  }
}

class GalleryStage extends React.Component {
  constructor(props){
    super(props);

    /*
     * 初始化imgFigure的排布范围
     *
     * 将整个舞台分为四个部分
     * |         |             |          |
     * |         |  centerPos  |          |
     * | leftSec |             | rightSec |
     * |         |-------------|          |
     * |         |  controller |          |
     *
     * 确定取值范围即确定极限值
     *
     */

    this.constant = {
      centerPos:{
        left: 0,
        right: 0
      },
      hPosRange:{
        leftSecX:[0,0],
        rightSecX:[0,0]
      },
      vPosRange:{
        x:[0,0],
        topY:[0,0]
      }
    }
  }

  componentDidMount(){
    //获取舞台的宽度和高度
    let stageDOM = React.findDOMNode(this.refs.stage),
      stageWidth = stageDOM.scrollWidth,
      stageHeight = stageDOM.scrollHeight,
      halfStageWidth = Math.ceil(stageWidth / 2),
      halfStageHeight = Math.ceil(stageHeight / 2);

    //获取imgFigure的宽度和高度
    let imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
      imgWidth = imgFigureDOM.scrollWidth,
      imgHeight = imgFigureDOM.scrollHeight,
      halfImgWidth = Math.ceil(imgWidth / 2),
      halfImgHeight = Math.ceil(imgHeight / 2);

    this.constant.centerPos = {
      left: halfStageWidth - halfImgWidth,
      top: halfStageHeight - halfImgHeight
    };
    this.constant.hPosRange.leftSecX[0]= 0;


  }


  render(){
    let controllerUnits =[],
      imgFigures =[];
    /*
     * @param value 包含图片信息的对象
     * @param index 图片在数组中的位置，方便后续定位
     */
    imgData.forEach((value,index) => {
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index}/>);
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

GalleryStage.defaultProps = {
};

export default GalleryStage;
