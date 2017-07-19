require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';
import ImgFigure from './imgFigure';
import ControllerUnits from './controllerUnits';

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

//随机生成给定区间中的一个数值
let getRandomNum = (min, max) => Math.ceil(Math.random()*(max-min)+min);

//随机生成-30到30区间的一个数值
let getRandomDeg = () => (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random()*30);

class GalleryStage extends React.Component {
    constructor(props) {
      super(props);

      /*
       * 将整个舞台分为四个区域
       *
       * |         |             |          |
       * |         |    upSec    |          |
       * |         |             |          |
       * | leftSec |-------------| rightSec |
       * |         | |centerImg| |          |
       * |         |-------------|          |
       * |         |  controller |          |
       * |         |             |          |
       *
       * 确定取值范围即确定极限值
       * 中心区域只有一张图片
       *
       */

      //初始化imgFigure的排布范围
      this.constant = {
        centerPos: {
          left: 0,
          right: 0
        },
        xPosRange: {
          leftSec: [0, 0],
          rightSec: [0, 0],
          topSec: [0,0]
        },
        yPosRange: {
          leftSec: [0, 0], //rightSecY的范围与leftSecY相同
          topSec: [0, 0]
        }
      };

      this.state = {
        //创建数组用于存储图片信息状态
        imgStateArr: [
          /*{
             pos:{
               left: '0',
               top: '0'
             },
             rotate: 0
             isInverse: false,
             isCenter: false
           }
           */
        ]
      };
    }

    //组件加载后，计算每张图片的位置范围
    componentDidMount(){

      //获取舞台的宽度和高度
      let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageWidth = stageDOM.scrollWidth,
        stageHeight = stageDOM.scrollHeight,
        halfStageWidth = Math.floor(stageWidth / 2),
        halfStageHeight = Math.floor(stageHeight / 2);

      //获取imgFigure的宽度和高度
      let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgWidth = imgFigureDOM.scrollWidth,
        imgHeight = imgFigureDOM.scrollHeight,
        halfImgWidth = Math.floor(imgWidth / 2),
        halfImgHeight = Math.floor(imgHeight / 2);

      //确定中心区域图片的位置
      this.constant.centerPos = {
        left: halfStageWidth - halfImgWidth,
        top: halfStageHeight - halfImgHeight
      };

      //确定水平方向左区的排布范围
      this.constant.xPosRange.leftSec[0] = -halfImgWidth;
      this.constant.xPosRange.leftSec[1] = halfStageWidth - 3 * halfImgWidth;
      //确定水平方向右区的排布范围
      this.constant.xPosRange.rightSec[0] = halfStageWidth + halfImgWidth;
      this.constant.xPosRange.rightSec[1] = stageWidth - halfImgWidth;
      //计算水平方向上区的图片的位置
      this.constant.xPosRange.topSec[0] = halfStageWidth - halfImgWidth;
      this.constant.xPosRange.topSec[1] = halfStageWidth;

      //确定垂直方向左区、右区的排布范围
      this.constant.yPosRange.leftSec[0] = -halfImgHeight;
      this.constant.yPosRange.leftSec[1] = stageHeight - halfImgHeight;
      //确定垂直方向上区的排布
      this.constant.yPosRange.topSec[0] = -halfImgHeight;
      this.constant.yPosRange.topSec[1] = halfStageHeight - 3 * halfImgHeight;

      this.rearrange(0);
    }

    /**
     * 在大管家里封装图片的反转功能，使imgFigure组件和controllerUnits都可以使用
     * @param index 当前翻转的图片对应的图片信息数组的索引值
     */
    inverse(index) {
      return ()=>{
        let imgStateArr = this.state.imgStateArr;
        imgStateArr[index].isInverse = !imgStateArr[index].isInverse;

        //触发component的重新渲染
        this.setState({
          imgStateArr: imgStateArr
        });
      }
    }

    /**
     * 当非居中的函数被点击时，通过rearrange函数，居中对应index的图片
     * @param index
     * @returns {function()}
     */
    center(index){
        return()=>{
          this.rearrange(index);
        }
    }

    /**
     * 重新进行imgFigure的排布
     * @param centerIndex 中心区域图片的索引
     */
    rearrange(centerIndex) {
      let imgStateArr = this.state.imgStateArr,
        constant = this.constant,
        centerPos = constant.centerPos,
        xPosRange = constant.xPosRange,
        yPosRange = constant.yPosRange,

        xPosRangeLeftSec = xPosRange.leftSec,
        xPosRangeRightSec = xPosRange.rightSec,
        xPosTopSec = xPosRange.topSec,

        yPosRangeLeftSec = yPosRange.leftSec,
        yPosRangeTopSec = yPosRange.topSec,

        imgTopInfoArr = [], //声明用于存储上区图片信息的数组对象
        imgTopNum = Math.floor(Math.random()*2), //上区图片数量取值为0或1
        imgTopIndex = 0, //初始化上区图片的索引值

        //声明数组对象用于存储中心图片信息
        imgCenterInfoArr = imgStateArr[centerIndex];

      //居中索引为centerIndex的图片
      imgCenterInfoArr[0]={
        pos: centerPos,
        rotate: 0,
        isCenter: true
      };

      //取出要排布在上区的图片状态信息
      imgTopIndex = Math.ceil(Math.random() * (imgStateArr.length - imgTopNum));
      imgTopInfoArr = imgStateArr.splice(imgTopIndex, imgTopNum);
      //排布位于上区的图片
      imgTopInfoArr.forEach((value, index)=> {
        imgTopInfoArr[index] = {
          pos: {
            left: getRandomNum(xPosTopSec[0],xPosTopSec[1]),
            top: getRandomNum(yPosRangeTopSec[0], yPosRangeTopSec[1])
          },
          rotate: getRandomDeg(),
          isCenter: false
        };
      });

      //排布左右两侧图片
      for (let i = 0, j = imgStateArr.length, k = j / 2; i < j; i++) {
        let xPosRangeLOrR = null;
        if (i < k) {
          xPosRangeLOrR = xPosRangeLeftSec;
        } else {
          xPosRangeLOrR = xPosRangeRightSec;
        }
        imgStateArr[i] = {
          pos: {
            left: getRandomNum(xPosRangeLOrR[0], xPosRangeLOrR[1]),
            top: getRandomNum(yPosRangeLeftSec[0], yPosRangeLeftSec[1])
          },
          rotate: getRandomDeg(),
          isCenter: false
        };

        //将原来取出用于上区排布的图片信息放回imgStateArr
        if (imgTopInfoArr && imgTopInfoArr[0]) {
          imgStateArr.splice(imgTopIndex, 1, imgTopInfoArr[0]);
        }

        //将原来取出放置在中心区域的图片信息放回imgStateArr
        imgStateArr.splice(centerIndex, 1, imgCenterInfoArr[0]);

        //触发component的重新渲染
        this.setState({
          imgStateArr: imgStateArr
        })
      }
    }

    render(){
      let imgFigures = [],
        controllerUnits = [];

      /**
       * @param value 包含图片信息的对象
       * @param index 图片在数组中的位置，方便后续定位
       */
      imgData.forEach((value, index) => {

        //初始化图片信息状态对象
        if (!this.state.imgStateArr[index]) {
          this.state.imgStateArr[index] = {
            pos: {
              left: 0,
              top: 0
            },
            rotate: 0,
            isInverse: false, //正面
            isCenter: false //不居中
          }
        }
        imgFigures.push(
          <ImgFigure
            key={index}
            data={value}
            ref={'imgFigure' + index}
            rearrange={this.state.imgStateArr[index]}
            inverse={this.inverse(index)} // 调用在父组件中封装好的功能
            center={this.center(index)}
          />
        );
        controllerUnits.push(
          <ControllerUnits
            key={index}
            rearrange={this.state.imgStateArr[index]}
            inverse={this.inverse(index)}
            center={this.center(index)}
          />
        );
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
      )
    }
  }
export default GalleryStage;
