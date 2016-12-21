//1108版本：修改IE8下的bug；优化代码：全选，修改顺序，封装调用

//====10.兼容IE8及以下，使其支持getElementsByClassName====
if(!document.getElementsByClassName){
	document.getElementsByClassName=function(cls){
		var ret=[];
		var els=document.getElementsByTagName('*');
		for(var i=0;i<els.length;i++){
			if(els[i].className.indexOf(cls)>=0){
				ret.push(els[i]);
			}
		}
		return ret;
	}
}

//====1.声明变量====
var item=document.getElementsByClassName("item");//得到item对象
var qua=document.getElementsByClassName("num");//得到数量框对象
var amo=document.getElementsByClassName("amount");
var pri=document.getElementsByClassName("price");
var totalAmo=document.getElementById("totalAmo");
var check=document.getElementsByClassName("check");
var credit=document.getElementsByClassName("credit");
var totalCre=document.getElementById("totalCre");
var checkAll=document.getElementById("checkAll");
var delSel=document.getElementById("delSel");


//****************12.1这里是基础函数
var arr=[];
for(var j=0;j<credit.length;j++){
	arr.push(credit[j].innerHTML);
}

//====4.小计当前行金额====
function getSubTotal(a){//参数a是指当前行
	var p=a.getElementsByTagName("td")[4];
	var q=a.getElementsByTagName("input")[1];//@todo4 这里用classname就一直报错，应该是因为类名太相似
	var am=a.getElementsByTagName("td")[6];
	am.innerHTML=(parseFloat(p.innerHTML)*parseInt(q.value)).toFixed(2);
}

//====6.总计金额和积分====
function getTotal(){
	sumA=0;
	sumC=0;
	for(var i=0;i<check.length;i++){
		if(check[i].checked){
		sumA+=parseFloat(amo[i].innerHTML);
		sumC+=parseInt(credit[i].innerHTML)*parseInt(qua[i].value);
		}
	}
	totalAmo.innerHTML=sumA;
	totalCre.innerHTML=sumC;
}

//====11.删除产品====
function delPro(pro){
	var title=pro.previousElementSibling;//notice:兼容IE8
	if(title){
		pro.parentNode.removeChild(title);
	}else{
		pro.parentNode.removeChild(pro.previousSibling);
	}
	pro.parentNode.removeChild(pro);
}


//****************12.2这里是初始化

//====9.初始化：全选、每行金额、总金额、总积分====
for(var i=0;i<pri.length;i++){  //初始化每行金额
	var p=parseFloat(pri[i].innerHTML);
	var q=parseInt(qua[i].value);
	amo[i].innerHTML=(p*q).toFixed(2);
	checkAll.checked=true;
	check[i].checked=true;
	item[i].className="item on";
}
getTotal();  //初始化总金额


//****************12.3这里是购物车功能
//notice: 因为删除，加减都要循环，代码过于类似，因此统一写在item上
for(var i=0;i<item.length;i++){
	//item[i].index=i;//@todo3 删除第一行后，最后一行就会出错(问题应该在这一行上)

//====2.数量加减和删除====
	item[i].onclick=function(e){
		var e=e || window.event;//notice: IE8及以下没有e
		var el=e.target || e.srcElement //IE8及以下没有target
		var cls=el.className;//得到当前点击对象的类名
		//var quaEl=qua[this.index]; //@todo3 删除后index值无法修改，故更改方法
		var quaEl=this.getElementsByTagName("input")[1];//@todo4 用classname IE8报错?
		var count=parseInt(quaEl.value);//@todo3 删除第1个后，最后1个无法删除
		switch(cls){
			case "add":
				quaEl.value=count+1;  //@todo2 如何判断数量不能超出库存
				getSubTotal(this);
				break;
			case "minus":
				if(count>1){
					quaEl.value=count-1;
					getSubTotal(this);
				}
				break;
			case "del":
				var conf=confirm('确定删除此商品吗？');
				if(conf){
					delPro(this);
				}//@todo1 这里可以再加一个撤销删除功能
				break;
		}
		getTotal();
	}

//====3.键盘输入不合法数量====
	qua[i].onblur=function(){
		var val=parseInt(this.value);
		if(isNaN(val)||val<1){  //notice:含有非数字或负数
			val=1;
		}
		if(this.value!=val){  //取整后不等于本身，说明是小数
			this.value=val;
		}
		getSubTotal(this.parentNode.parentNode);//得到item
		getTotal();
	}

//====5.选择商品====
	check[i].onclick=function(){
		if(this.checked){//点击选中的话，高亮该行
			this.parentNode.parentNode.className="item on";
		}else{
			this.parentNode.parentNode.className="item";
			if(checkAll.checked){
			//notice:如果取消该行时，全选按钮是被选中了，则取消全选
				checkAll.checked=false;
			}
		}
		for(var j=0;j<check.length;j++){
		//notice:如果所有行都被选中，全选按钮应被勾选
			if(!check[j].checked){
				break;
			}
			if(j==check.length-1){
			//如果执行到了最后一个，说明所有行都被选中了
				checkAll.checked=true;
			}
		}
		getTotal();
	}
}

//====7.全选商品====
checkAll.onclick=function(){
	if(this.checked){
		for(var i=0;i<check.length;i++){
			check[i].checked=true;
			item[i].className="item on";
		}
	}else{
		for(var i=0;i<check.length;i++){
			check[i].checked=false;
			item[i].className="item";
		}
	}
	getTotal();
}

//====8.删除所选====
delSel.onclick=function(){
	var conf=confirm('确定删除选中商品吗？');
	if(conf){
		for(var i=0;i<check.length;i++){
			if(check[i].checked){
				var delEl=check[i].parentNode.parentNode;//得到item
				delPro(delEl);
				i--;//notice:删除以后check数组内变化了
			}
		}
	getTotal();
	}
}







