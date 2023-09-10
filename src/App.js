import { useState,useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom'
import React from 'react';
import './App.css';

function App() {

	const [inputChating, setInputChatting] = useState("");	
	const [inputChatingSubmit, setInputChattingSubmit] = useState("Send");	
	const [inputUsername, setInputUsername] = useState("");	
	const [formIsHalfFilledOut, setFormIsHalfFilledOut] = useState("true");
	const [showUseEffect, setShowUseEffect] = useState("false");
	const [enteryourname,setEnterYourName] = useState("");	
	const [data, setData] = useState([]);
	const [setupPaging,setSetupPaging] = useState("");
	const [showLoadMore, setShowLoadMore] = useState("");
	let lclStorage = [];	
	let first_data = [];
	let paging = 25;
	let currentPaging = 0;
	let dateString = "";

	function loadMore(){
		let first_data = [];
		let initial = 0;
		if(setupPaging<paging){
			setShowLoadMore('');								
		}else{
			initial = setupPaging - paging;
		}
		let xxy = [];
		let data_load = [];				
		for (var i = 0; i < localStorage.length; i++){
			var xx = JSON.parse(localStorage.getItem(localStorage.key(i)));
			for (var j = 0; j < xx.length; j++){
				var yy = xx[j].split("|");
				xxy.push(yy[1]);
				let lcl = [];
				lcl["chat_name"] = localStorage.key(i);
				lcl["chat_text"] = yy[0];
				var dateFormat = new Date(parseInt(yy[1]));
				lcl["chat_time"] = dateFormat.getDate()+
           "/"+(dateFormat.getMonth()+1)+
           "/"+dateFormat.getFullYear()+
           " "+dateFormat.getHours()+
           ":"+dateFormat.getMinutes()+
           ":"+dateFormat.getSeconds();				
				data_load[yy[1]]=lcl;	
			}			
		}
		xxy.sort();
		var chat_position = 'chat-left';		
		var current_chat_name = '';
		for (var i = initial; i < xxy.length; i++){
			if(current_chat_name == ''){
				current_chat_name = data_load[xxy[i]]['chat_name']; 
			}else if(current_chat_name != data_load[xxy[i]]['chat_name']){
				if(chat_position == 'chat-left'){
					chat_position = 'chat-right';
				}else{
					chat_position = 'chat-left';					
				}
				current_chat_name = data_load[xxy[i]]['chat_name']; 				
			}
			data_load[xxy[i]]['chat_position'] = chat_position;
			first_data.push(data_load[xxy[i]]);									
		}
		if(localStorage.getItem("countPaging")!=null){
			let countPaging=parseInt(localStorage.getItem("countPaging"))+1;
			localStorage.setItem("countPaging",countPaging);								
		}else{
			localStorage.setItem("countPaging","1");											
		}
		setSetupPaging(initial);				
		setData(first_data);		
	}
	
	function handleApi(api='') {
		if(api == 'submit'){
			if(inputChating != ''){
				if(localStorage.getItem(enteryourname) != null){
					lclStorage = JSON.parse(localStorage.getItem(enteryourname));
					lclStorage.push(inputChating+"|"+(new Date().getTime()));
					localStorage.setItem(enteryourname,JSON.stringify(lclStorage));			
				}else{
					lclStorage.push(inputChating+"|"+(new Date().getTime()));
					localStorage.setItem(enteryourname,JSON.stringify(lclStorage));			
				}
				setInputChatting("");
				loadingData();
			}else{
				alert('Please type something!');
			}
		}
	}

	const loadDataOnlyOnce = () => {
		let enteryourname = prompt("Please enter your name:", "");
		setEnterYourName(enteryourname);
		loadingData();		
	}

	function loadingData(){
		let data_load = [];				
		let xxy = [];
		for (var i = 0; i < localStorage.length; i++){
			var xx = JSON.parse(localStorage.getItem(localStorage.key(i)));
			for (var j = 0; j < xx.length; j++){
				var yy = xx[j].split("|");
				xxy.push(yy[1]);
				let lcl = [];
				lcl["chat_name"] = localStorage.key(i);
				lcl["chat_text"] = yy[0];		
				var dateFormat = new Date(parseInt(yy[1]));
				lcl["chat_time"] = dateFormat.getDate()+
           "/"+(dateFormat.getMonth()+1)+
           "/"+dateFormat.getFullYear()+
           " "+dateFormat.getHours()+
           ":"+dateFormat.getMinutes()+
           ":"+dateFormat.getSeconds();								
				data_load[yy[1]]=lcl;	
			}			
		}
		xxy.sort();
		first_data = [];
		if(xxy.length > paging){
			let startInitial=xxy.length-paging;
			let countPaging = localStorage.getItem("countPaging");
			console.log("countPaging=>"+countPaging);
			if(countPaging>0){
				for(var b=0;b<countPaging;b++){
					if(paging<startInitial){
						startInitial=startInitial-paging;													
					}else{
						startInitial=0;																			
					}
				}		
			}
			console.log("startInitial=>"+startInitial);
			var chat_position = 'chat-left';	
			var current_chat_name = '';
			for (var i = startInitial; i < xxy.length; i++){
				if(current_chat_name == ''){
					current_chat_name = data_load[xxy[i]]['chat_name']; 
				}else if(current_chat_name != data_load[xxy[i]]['chat_name']){
					console.log('current_chat_name=>'+current_chat_name+' chat_name=>'+data_load[xxy[i]]['chat_name']);
					if(chat_position == 'chat-left'){
						chat_position = 'chat-right';
					}else{
						chat_position = 'chat-left';					
					}
					current_chat_name = data_load[xxy[i]]['chat_name']; 				
				}
				data_load[xxy[i]]['chat_position'] = chat_position;
				console.log(data_load[xxy[i]]);
				first_data.push(data_load[xxy[i]]);									
			}			
			setSetupPaging(startInitial);
			if(startInitial>0){
				setShowLoadMore('Load More');															
			}
		}else{			
			var chat_position = 'chat-left';		
			var current_chat_name = '';
			for (var i = 0; i < xxy.length; i++){
				if(current_chat_name == ''){
					current_chat_name = data_load[xxy[i]]['chat_name']; 
				}else if(current_chat_name != data_load[xxy[i]]['chat_name']){
					if(chat_position == 'chat-left'){
						chat_position = 'chat-right';
					}else{
						chat_position = 'chat-left';					
					}
					current_chat_name = data_load[xxy[i]]['chat_name']; 				
				}
				data_load[xxy[i]]['chat_position'] = chat_position;
				console.log(data_load[xxy[i]]);
				first_data.push(data_load[xxy[i]]);									
			}			
			setShowLoadMore('');													
			setSetupPaging(0);			
		}
		setData(first_data);
	}
		
	useEffect(() => {
		loadDataOnlyOnce();
		setInterval(() => {
			loadingData();
        }, 3000);  		
	}, [])
  
	return (
		<form onSubmit={(e) => {handleApi('submit');e.preventDefault();}}>
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" rel="stylesheet"/>
			<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"/>			
			<div class="container">
				<div class="page-title">
					<div class="row gutters">
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
							<h5 class="title">Chat App</h5>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
							<a onClick={(e) => {loadMore();e.preventDefault();}}>{showLoadMore}</a>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"> </div>						
					</div>
				</div>
				<div class="content-wrapper">
					<div class="row gutters">
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
							<div class="card m-0">
								<div class="row no-gutters">
									<div class="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
										<div class="chat-container">
										{data.length > 0 && (
											<ul class="chat-box chatContainerScroll">
											  {data.map(content => (
													<li className={content.chat_position}>
														<div class="chat-avatar">
															<img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin"/>
															<div class="chat-name">{content.chat_name}</div>
															<div class="chat-text">
																{content.chat_text}  
															</div>
															<div class="chat-hour">
																{content.chat_time} 
																<span class="fa fa-check-circle"></span>
															</div>														
														</div>
													</li>
											  ))}
											</ul>
										)}	
											<div class="form-group mt-3 mb-0">
												<textarea class="form-control"
												 rows="3"  		
												 type="text" 
												 name="inputChating"
												 onChange={(e) => setInputChatting(e.target.value)}
												 placeholder="Type your message here..."												 
												 value={inputChating}
												 />												
											</div>											
											<input type="submit" name="chatting" value={inputChatingSubmit}/>											
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>	
				</div>
			</div>
			<input type="hidden" name="paging" value={setupPaging} />
			<br/>	  
			<script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.bundle.min.js"></script>
		</form>  
	);
}

export default App;
