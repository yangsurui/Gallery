# 基于react.js的画廊应用
## Problem1(已解决)
一开始给img-figure增加了backface-visibility: hidden属性，
点击img-figure实现了正面到反面的翻转效果，
但img-desc元素没有在网页中显示

后来分别给img和figurecaption增加了backface-visibility: hidden属性，
修正了这个问题

## Problem2(已解决)

『Problem』虽然上一次提交使img-desc元素出现在了网页中，但通过chrome的检查功能发现页面并未显示img-figure元素，同时"transform: rotate(180deg)"这条属性只应用在了img-figure元素上，所以在背面点击的时候会没有反应。

『Solution』类似对img-figure，利用条件运算符给img-desc添加is-inverse，但操作起来不是很流畅，**有的时候点击背面会没有反应(待优化)**

### 7.4
解决方法：

利用事件冒泡，传递event参数

```
handleClick(e){
	event.stopPropagation();
	event.preventDefault();
}
```


## Problem3(已解决)

imgFigure15的位置、角度不会随机变化

## Problem4(已解决)
imgFigure和controllerUnits的翻转动画不够立体

### 7.4
解决方法：

```
.img-sec{
	perspective: 1800px
}
.is-inverse{
	transform-origin: 0 50% 0; //对应的值分别表示x,y,z轴
	transform: translate(imgFigure的宽度) rotateY(180deg)
}

