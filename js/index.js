(function(window){
	'use strict';

		function init() {
				var allMsg = {

					morning:{
					  listMsg: {},
					  noteMsg: {}
					},
					noon:{
					  listMsg: {},
					  noteMsg: {}
					},
					night:{
					  listMsg: {},
					  noteMsg: {}
					}

				};	
				var functions = {
						setAttr:function() {
							Object.assign(document.querySelector('#tempList'),{
								index : '-1',
								cat : 'morning',
								data : 'listMsg'
							})
							Object.assign(document.querySelector('#tempNote'),{
								index : '-1',
								cat : 'morning',
								data : 'noteMsg'
							})
							Object.assign(document.querySelector('#dataList'),{
								index : '-1',
								cat : 'noon',
								data : 'listMsg'
							})	
							Object.assign(document.querySelector('#dataNote'),{
								index : '-1',
								cat : 'noon',
								data : 'noteMsg'
							})
							Object.assign(document.querySelector('#finishList'),{
								index : '-1',
								cat : 'night',
								data : 'listMsg'
							})	
							Object.assign(document.querySelector('#finishNote'),{
								index : '-1',
								cat : 'night',
								data : 'noteMsg'
							})																												
						},
					    defineProperty:function() {
					    	// 把 allMsg 中每個属性，轉為 getter/setter 形式
					    	for(var data in allMsg){
								for(var name in allMsg[data]){
									this.defineReactive(name, allMsg[data][name], allMsg[data], data);
									//name:發文類型(待辦事項或詳細內容),allMsg[data][name]:單項資料內容,allMsg[data]:全部資料內容,data:發文類別(早上、中午、晚上)
								}					    		
					    	}
					    },
						defineReactive:function(key, val , data , cat){
							//將this儲存起來,以便之後呼叫createItem函數
							var self = this;
							  Object.defineProperty(data, key, {
							    get: function () {
							      return val;
							    },
							    set: function (newVal) {
							      if(newVal[0] === 'add'){	
									//新增資料

									  //新增列表到網頁上	
								      self.createItem(newVal,key,cat);	

								      //新增資料到物件		      
								      val[newVal[1]] = newVal[2]; 
								      console.log(key, val , data , cat);	
								      //key:發文類型(待辦事項或詳細內容),val:單項資料內容,data:全部資料內容,cat:發文類別(早上、中午、晚上)

							      }else if(newVal[0] === 'delete'){
									//刪除資料

							      		//尋找此項目的類別,並從網頁上刪除
										document.querySelector('.'+cat+'').removeChild(document.querySelectorAll('.'+cat+' > div')[newVal[1]]);

										//從物件中刪除資料
										delete 	val[newVal[2]];							      			
								      	console.log(key, val , data , cat);
										//key:發文類型(待辦事項或詳細內容),val:單項資料內容,data:全部資料內容,cat:發文類別(早上、中午、晚上)

							      }else if(newVal[0] === 'edit'){
							      	//修改資料

							      		if( val[newVal[2]] === newVal[3]){
							      			//如果修改內容和之前相同,則保持原狀
							      			return;
							      		}
							      		else if(newVal[3].replace(/\s/g,"") === ''){
											//如果修改內容為空白,則刪除資料
											document.querySelector('.'+cat+'').removeChild(document.querySelectorAll('.'+cat+' > div')[newVal[1]]);
											delete 	val[newVal[2]];	
											console.log(key, val , data , cat);	 
											//key:發文類型(待辦事項或詳細內容),val:單項資料內容,data:全部資料內容,cat:發文類別(早上、中午、晚上)
							      		}
							      		else{
											val[newVal[2]] = newVal[3];	
											//更新資料						      			
									      	console.log(key, val , data , cat);	 
									      	//key:發文類型(待辦事項或詳細內容),val:單項資料內容,data:全部資料內容,cat:發文類別(早上、中午、晚上)								      			
							      		}

							      }

							    }
							  });						
						},
						submit:function() {
							//待辦事項送出	
							document.querySelectorAll('form').forEach(function(form){
								form.children[0].onfocus = function() {
									this.setAttribute('placeholder',''); 

								}
								form.children[0].onblur = function() {
									this.setAttribute('placeholder','Enter the list here...');

								}						
								form.onsubmit = function(e){
									var index = this.children[0].index;
									//避免跳頁	
									e.preventDefault();

									//呼叫submitData函數,將資料送出	
									submitData.call(this,this.children[0].cat,index);
									this.children[0].value = ''; 	

								};
							})
							document.querySelectorAll('textarea[name="enterNote"]').forEach(function(note){
								note.value = 'Enter the note here...';
								note.onfocus = function() {
									if(this.value === 'Enter the note here...')
									this.value = '';	
								}
								note.onblur = function() {
									if(this.value === '')
									this.value = 'Enter the note here...';	
								}						

							})
							document.querySelectorAll('.plane').forEach(function(plane) {
								plane.onclick = function(){
									    //呼叫submitData函數,將資料送出	
										submitData.call(this.previousElementSibling,this.previousElementSibling.cat,this.previousElementSibling.index);	
										this.previousElementSibling.value = 'Enter the note here...';											
								}
							})

						  	var submitData = function (data,index) {
						  		index ++ ;
						  		if(!!this.children[0]){
									
									if(this.children[0].value.replace(/\s/g,"") === ''){
										//如果沒有輸入文字,則跳出請輸入文字視窗
										alert('請輸入文字!!');
									}else{
										this.children[0].index = index;
										//用陣列將傳送資料傳送過去
										allMsg[data][this.children[0].data] = [ 'add', index , this.children[0].value] ;
									}
									
									
						  		}else{
						  			if(this.value.replace(/\s/g,"") === '' || this.value === 'Enter the note here...'){
						  				//如果沒有輸入文字,則跳出請輸入文字視窗
										alert('請輸入文字!!');
						  			}else{
										this.index = index;
										//用陣列將傳送資料傳送過去
										allMsg[data][this.data] = [ 'add', index ,this.value ];						  				
						  			}

						  		}
							}						
						},
						buttonClick:function() {
							//上方橘色button切換功能
							var button = document.querySelectorAll('.submit > input'),
								list = document.querySelectorAll('input[name="enterList"]');
							list.forEach(function(list){
								list.classList.add('active');
							})
							button[0].classList.add('active');
							button[2].classList.add('active');
							button[4].classList.add('active');
							button.forEach(function(button,i){
								button.onclick = function() {
									if(this.className.indexOf('active') === -1){
										this.classList.add('active');
										var next = this.nextElementSibling,
											list = this.parentNode.nextElementSibling.children[0].children[0],
											note = this.parentNode.nextElementSibling.children[1];

										!!next ? next.classList.remove('active') : this.previousElementSibling.classList.remove('active');
										if(list.className.indexOf('active') !== -1){
											list.classList.remove('active');
											note.classList.add('active'); 
										}else{
											note.classList.remove('active');
											list.classList.add('active');
										}								
									}												
								}
							});							
						},
						createItem:function(newVal,key,cat) {
							//將新的項目放置到網頁上
							var item = document.createElement('div'),
								writeList = document.createElement('div'),
								content = document.createElement('p'),
								edit = document.createElement('div'),
								ico = document.createElement('div'),
								editIcon = document.createElement('i'),
								deleteIcon = document.createElement('i'),
								photo = document.createElement('img'),
								self = this;

								
								if(key === 'listMsg'){
									item.setAttribute('class','item');
									Object.assign(item,{
										dataIndex : newVal[1],
										content : newVal[2]
									})
									writeList.setAttribute('class','write-list'); 
								}else{
									item.setAttribute('class','item noteMsg');
									Object.assign(item,{
										dataIndex : newVal[1],
										content : newVal[2]
									})
									writeList.setAttribute('class','write-note');
								}
								
								edit.setAttribute('class','edit');
								ico.setAttribute('class','ico');
								editIcon.setAttribute('class','fa fa-pencil-square-o edit-icon');
								deleteIcon.setAttribute('class','fa fa-times delete-icon');
								Object.assign(deleteIcon,{
										cat : cat,
										key : key
								})	
								Object.assign(editIcon,{
										cat : cat,
										key : key
								})																

								photo.setAttribute('src','img/users-pic.png');
								content.edit = 'false';

								content.innerHTML = newVal[2].replace(/\n/g, '<br/>');
								ico.appendChild(editIcon);
								ico.appendChild(deleteIcon);
								edit.appendChild(ico);
								edit.appendChild(photo);
								writeList.appendChild(content);
								item.appendChild(writeList);
								item.appendChild(edit);



								document.querySelector('.'+ cat +'').appendChild(item);
								setTimeout(function(){
									item.classList.add('active');
								},0);
								
								document.querySelectorAll('.delete-icon').forEach(function(deleteIcon) {
								//刪除功能
									deleteIcon.onclick = function() {
										var cat = this.cat,
											thisItem = this.parentNode.parentNode.parentNode;
										allMsg[cat][this.key] = ['delete',self.getIndex(thisItem),thisItem.dataIndex];
									}
								});
								document.querySelectorAll('.write-list').forEach(function(list){
								//檢查項目是否已完成
									list.children[0].onclick = function() {
										this.classList.toggle('completed');
									}
								})
								document.querySelectorAll('.edit-icon').forEach(function(editIcon) {
								//編輯功能
									editIcon.onclick = function() {

										var cat = this.cat,
											thisItem = this.parentNode.parentNode.parentNode,
											content = this.parentNode.parentNode.previousElementSibling.children[0],
											textbox;

										if(content.edit === 'true'){
											textbox = document.createElement('p');
											thisItem.content = content.value;
											textbox.innerHTML = content.value.replace(/\n/g, '<br/>');
											content.parentNode.removeChild(content);
											this.parentNode.parentNode.previousElementSibling.appendChild(textbox);
											allMsg[cat][this.key] = ['edit',self.getIndex(thisItem),thisItem.dataIndex,content.value];
										}else{

											if(this.key === 'listMsg'){
												textbox = document.createElement('input');
												textbox.setAttribute('type','text');
											}else{
												textbox = document.createElement('textarea');
											}
											textbox.value = thisItem.content.replace(/<br\s*[\/]?>/gi, "\n");
											textbox.edit = 'true';
											content.parentNode.removeChild(content);
											this.parentNode.parentNode.previousElementSibling.appendChild(textbox);
										}

										
										
									}
								})																		
						},
						getIndex: function(node){
						//取得dom元素的index
			                var children = node.parentNode.childNodes;
			                var num = 0 ,i ,max;
			                for (i=0,max=children.length; i<max; i++) {
			                      if(children[i] === node){
			                          return num;                                    
			                      }else if(children[i].nodeType === 1){
			                          num++;
			                      }
			                }
			                
		            	}				
				}
				functions.setAttr();
				functions.defineProperty();
				functions.buttonClick();	
				functions.submit();							
		}			

		document.addEventListener('DOMContentLoaded', function() {
			init();	
		});

})(window)
