(function(window){
	'use strict';

		function init() {
				var allMsg = {

					template:{
					  listMsg: {},
					  noteMsg: {}
					},
					data:{
					  listMsg: {},
					  noteMsg: {}
					},
					finished:{
					  listMsg: {},
					  noteMsg: {}
					}

				};	
				var functions = {

					    defineProperty:function() {
					    	for(var data in allMsg){
								for(var name in allMsg[data]){
									this.defineReactive(name, allMsg[data][name], allMsg[data], data);
								}					    		
					    	}
					    },
						defineReactive:function(key, val , data , cat){
							var self = this;
							  Object.defineProperty(data, key, {
							    get: function () {
							      return val;
							    },
							    set: function (newVal) {
							      if(newVal[0] === 'add'){	

								      self.createItem(newVal,key,cat);				      
								      val[newVal[1]] = newVal[2];	
								      console.log(key, val , data , cat);	

							      }else if(newVal[0] === 'delete'){

										document.querySelector('.'+cat+'').removeChild(document.querySelectorAll('.'+cat+' > div')[newVal[1]]);
										delete 	val[newVal[2]];							      			
								      	console.log(key, val , data , cat);

							      }else if(newVal[0] === 'edit'){

							      		if( val[newVal[2]] === newVal[3]){
							      			return;
							      		}
							      		else if(newVal[3].replace(/\s/gi,"") === ''){

											document.querySelector('.'+cat+'').removeChild(document.querySelectorAll('.'+cat+' > div')[newVal[1]]);
											delete 	val[newVal[2]];	
											console.log(key, val , data , cat);	 
							      		}
							      		else{
											val[newVal[2]] = newVal[3];								      			
									      	console.log(key, val , data , cat);	 								      			
							      		}

							      }

							    }
							  });						
						},
						submit:function() {
							document.querySelectorAll('form').forEach(function(form){
								form.children[0].onfocus = function() {
									this.setAttribute('placeholder',''); 

								}
								form.children[0].onblur = function() {
									this.setAttribute('placeholder','Enter the list here...');

								}						
								form.onsubmit = function(e){
									var index = this.children[0].getAttribute('index');
									e.preventDefault();
									submitData.call(this,this.children[0].getAttribute('cat'),index);
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
								// note.onkeydown = function(e) {
								// 	if(e.keyCode === 13){
								// 		e.preventDefault();
								// 	}							
								// }

							})
							document.querySelectorAll('.plane').forEach(function(plane) {
								plane.onclick = function(){
									console.log(this.previousElementSibling,this.previousElementSibling.getAttribute('cat'),this.previousElementSibling.getAttribute('index'));
										submitData.call(this.previousElementSibling,this.previousElementSibling.getAttribute('cat'),this.previousElementSibling.getAttribute('index'));	
										this.value = 'Enter the note here...';											
								}
							})

						  	var submitData = function (data,index) {
						  		index ++ ;
						  		if(!!this.children[0]){
									
									if(this.children[0].value.replace(/\s/gi,"") === ''){
										alert('請輸入文字!!');
									}else{
										this.children[0].setAttribute('index' , index );
										allMsg[data][this.children[0].getAttribute('data')] = [ 'add', index , this.children[0].value] ;
									}
									
									
						  		}else{
						  			if(this.value.replace(/\s/gi,"") === '' || this.value === 'Enter the note here...'){
										alert('請輸入文字!!');
						  			}else{
										this.setAttribute('index' , index );
										allMsg[data][this.getAttribute('data')] = [ 'add', index ,this.value ];						  				
						  			}

						  		}
							}						
						},
						buttonClick:function() {
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
											form = this.parentNode.nextElementSibling.children[0],
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
									item.setAttribute('dataIndex',newVal[1]);
									item.setAttribute('content',newVal[2]);
									writeList.setAttribute('class','write-list'); 
								}else{
									item.setAttribute('class','item noteMsg');
									item.setAttribute('dataIndex',newVal[1]);
									item.setAttribute('content',newVal[2]);
									writeList.setAttribute('class','write-note');
								}
								
								edit.setAttribute('class','edit');
								ico.setAttribute('class','ico');
								editIcon.setAttribute('class','fa fa-pencil-square-o edit-icon');
								deleteIcon.setAttribute('class','fa fa-times delete-icon');
								deleteIcon.setAttribute('cat', cat);
								editIcon.setAttribute('cat', cat);
								deleteIcon.setAttribute('key', key);
								editIcon.setAttribute('key', key);
								photo.setAttribute('src','img/users-pic.png');
								content.setAttribute('edit','false');

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
									deleteIcon.onclick = function() {
										var cat = this.getAttribute('cat'),
											thisItem = this.parentNode.parentNode.parentNode;
										allMsg[cat][this.getAttribute('key')] = ['delete',self.getIndex(thisItem),thisItem.getAttribute('dataIndex')];
									}
								});
								document.querySelectorAll('.write-list').forEach(function(list){
									list.children[0].onclick = function() {
										this.classList.toggle('completed');
									}
								})
								document.querySelectorAll('.edit-icon').forEach(function(editIcon) {
									editIcon.onclick = function() {

										var cat = this.getAttribute('cat'),
											thisItem = this.parentNode.parentNode.parentNode,
											content = this.parentNode.parentNode.previousElementSibling.children[0],
											textbox;

										if(content.getAttribute('edit') === 'true'){
											textbox = document.createElement('p');
											thisItem.setAttribute('content', content.value);
											textbox.innerHTML = content.value.replace(/\n/g, '<br/>');
											content.parentNode.removeChild(content);
											this.parentNode.parentNode.previousElementSibling.appendChild(textbox);
											allMsg[cat][this.getAttribute('key')] = ['edit',self.getIndex(thisItem),thisItem.getAttribute('dataIndex'),content.value];
										}else{

											if(this.getAttribute('key') === 'listMsg'){
												textbox = document.createElement('input');
												textbox.setAttribute('type','text');
											}else{
												textbox = document.createElement('textarea');
											}
											textbox.value = thisItem.getAttribute('content').replace(/<br\s*[\/]?>/gi, "\n");
											textbox.setAttribute('edit','true');
											content.parentNode.removeChild(content);
											this.parentNode.parentNode.previousElementSibling.appendChild(textbox);
										}

										
										
									}
								})																		
						},
						getIndex: function(node){
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

				functions.defineProperty();
				functions.buttonClick();	
				functions.submit();							
		}			

		document.addEventListener('DOMContentLoaded', function() {
			init();
		});

})(window)