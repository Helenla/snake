//游戏参数配置
var config={
	map:{width:800,height:600},
	square:{width:50,height:50},
	getCols:function(){return this.map.width/this.square.width;},
	getRows:function(){return this.map.height/this.square.height;},
	getNum:function(){return this.getCols()*this.getRows();}
}
//游戏辅助变量
var help={
	squares:[],//全部span
	snake:[],
	foods:[],
	foodIndex:-1,
	dir:3,
	handler:null
} 
//初始化地图
function initMap(){
	id('map').style.width=config.map.width+"px";
	id('map').style.height=config.map.height+"px";
	var num=config.getNum();
	for(var i=0;i<num;i++){
		var span=document.createElement('span');
		span.style.width=config.square.width+"px";
		span.style.height=config.square.height+"px";
		id('map').appendChild(span);
		help.squares.push(span);
		if(i<=4){
			help.snake.push(i);
			span.className='snake';
		}else{
			help.foods.push(i);
		}
	}
}
function isInBody(h_new_index){
	for(var i=1;i<help.snake.length-1;i++){
		if(help.snake[i]==h_new_index){
			return true;
		}else{
			return false;
		}
	}
}
function showFoods(){
	//随机刷新食物
	var index=Math.floor(Math.random()*help.foods.length);
	help.foodIndex=help.foods[index];
	help.squares[help.foods[index]].className='food';
}
function removeEleFromArr(arr,ele){
	for(var i=0;i<arr.length;i++){
		if(arr[i]==ele){
			arr.splice(i,1);
			break;
		}
	}
}
function snakeMove(){
	//处理头
	var h_index=help.snake[help.snake.length-1];
	var h_new_index=-1;//新蛇头位置编号
	switch(help.dir){
		case 1://向左
			//h_new_index=h_index-1;
			h_new_index=h_index%config.getCols()==0
						?h_index+(config.getCols()-1)
						:h_index-1;
			break;
		case 2://向上
			h_new_index=h_index<config.getCols()
						?(config.getRows()-1)*config.getCols()+h_index
						:h_index-config.getCols();
			break;
		case 3://向右
			h_new_index=h_index+1;
			h_new_index=h_new_index%config.getCols()==0
						?h_new_index-config.getCols()
						:h_new_index;
			break;
		case 4://向下
			h_new_index=h_index+config.getCols();
			h_new_index=h_new_index>=config.getNum()
						?h_new_index-config.getNum()
						:h_new_index;
			break;
	}
	//判断有没有结束
	if(isInBody(h_new_index)){
		clearInterval(help.handler);
		alert("失败...");
		if(confirm('重来?')){
			window.location.href=window.location.href;//刷新本地页面
		}else{
			window.close();
		}
		return;
	}
	removeEleFromArr(help.foods,h_new_index);
	help.snake.push(h_new_index);
	help.squares[h_new_index].className='snake';
	//处理尾
	if(h_new_index!=help.foodIndex){
		help.squares[help.snake[0]].className='';
		help.foods.push(help.snake.shift()); 
	}else{
		showFoods();
	}
}
window.onload=function(){
	initMap();
	showFoods();
	handler=setInterval(snakeMove,300);
	document.onkeyup=function(e){
		if(e.keyCode>=37&&e.keyCode<=40)
		help.dir=e.keyCode-36;
	}
}