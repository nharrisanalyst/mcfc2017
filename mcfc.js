//d3 boilerplate 


var b={t:20,r:20,b:80,l:50};
var w=1000-b.r-b.l;
var h=600-b.t-b.b;
var lw=175;
var lh=600;

var svg = d3.select('#root').append('svg')
					.attr('id','mainsvg')
					.attr('width',w+b.r+b.l)
					.attr('height',h+b.t+b.b);
					
					
					
var g = svg.append('g').attr('id','maing')
						.attr('width',w)
						.attr('height',h)
						.attr('transform','translate('+b.l+','+b.t+')');




d3.queue()
	.defer(d3.csv,'data/mcfc2017.csv')
	.await(go)
	
	
	
 function go(err,data){
 	if(err){alert('error in getting data')}
 	
    keys=d3.keys(data[0]);
 		
		keys.pop();
 		
 		
 	console.log(keys)
	var lineData=[]; 
 
 	keys.forEach(function(player,i){
    	if(player !='team'){
    		var intObject={player:player,values:[{team:'start',min:0}]};
    		lineData.push(intObject);
    		var min =0;
    		data.forEach(function(row){
    		
    		var rowObject={team:row.team,min: min+=parseInt(row[player])}
    		lineData[i].values.push(rowObject)
    		
    		
    		})
    
    
    }})
 
  	xValues=data.map(function(row){
  					return  row.team;
  
  	})
 
    xValues.unshift('start');
 	console.log(xValues);
 
 	const maxY=2900;
 
	var scaleX = d3.scaleOrdinal()
   					.domain(xValues)
   					.range(d3.range(0,w,(w/xValues.length)));
   					
   					
    var xAxis=d3.axisBottom(scaleX);
    
    var scaleY = d3.scaleLinear()
    					.domain([0,maxY])
    					.range([h,0]);
    
    var yAxis=d3.axisLeft(scaleY);					
    
    
    g.append('g').attr('class','xaxis').attr('transform','translate(0,'+h+')').call(xAxis)
    									.selectAll("text")	
        								.style("text-anchor", "end")
        								.attr("dx", "-.8em")
        								.attr("dy", ".15em")
        								.attr("transform", "rotate(-65)");
     g.append('g').attr('class','yaxis').call(yAxis);
   					
   	
 	line = d3.line()
 			.x(function(d){return scaleX(d.team)})
 			.y(function(d){return scaleY(d.min)})
 			
 			
 	var graph = g.selectAll('.playerPaths').data(lineData).enter().append('path').attr('class',function(d,i){return 'player'+i+" playerPaths"})
 	
 	graph.attr('d',function(d){return line(d.values)}).attr('fill','none').attr('stroke','gray').attr('stroke-width',3)
                .on('mouseover',mouseover)
                .on('mouseout',mouseout);
    var circleData=[]
    
    lineData.forEach(function(player,i){
    		player.values.forEach(function(value){
    		
    		circleData.push({xValue:value.team, yValue:value.min, player:'player'+i})
    		
    		})
    		
    
    })
   
   
   var circles = g.selectAll('circle').data(circleData).enter().append('circle').attr('class',function(d){return 'circle'+ d.player+" playerCircles"});
 	
 	circles.attr('cx',function(d){return scaleX(d.xValue)}).attr('cy',function(d){return scaleY(d.yValue)})
 			.attr('r',3).attr('fill','#545454');
 
 
 
 //MCFC color #c0dff2
	var legend =d3.select('#legendPlayers').append('svg').attr('width',lw).attr('height',lh).attr('id','legendPlayers');
 
	var legendG= legend.selectAll('g').data(keys).enter().append('g').attr('transform',function(d,i){return 'translate(20,'+((i*20)+30)+')'})
	
		legendG.append('rect').attr('class',function(d,i){return 'rectplayer'+i}).attr('width',10).attr('height',10).attr('fill','gray').attr('x',0).attr('y',0);
		
		legendG.append('text').attr('class',function(d,i){return 'textplayer'+i}).attr('x',15).attr('y',10).text(function(d){return d});
       
       legendG.on('click',click)
       			.on('mouseover',mouseover)
       			.on('mouseout',mouseout);
 
 }
 
 
 function mouseover(d,i){
 	
 console.log(i);
   var path = d3.select(".player"+i);
   path.style('stroke','#c0dff2').style('stroke-width',5)
   
   path.raise();
   
   var circle = d3.selectAll(".circleplayer"+i)
        
   		circle.style('fill','#b5d3e5').style('r',5)
   		circle.raise();
   
  var rect = d3.select(".rectplayer"+i)
  		rect.style('fill','#c0dff2')
 	var text = d3.select(".textplayer"+i)
 			text.style('fill','#c0dff2')
 	var key = keys[i]
 	console.log(key);
 	var playerKey='player'+i;
 	
 d3.selectAll('.playerPaths').style('opacity',function(d){if(d.player!=key){return .8}else{ return 1}})
  	d3.selectAll('.playerCircles').style('opacity',function(d){if(d.player!=playerKey){return .8}else{ return 1}})
 
 }
 
 function mouseout(d,i){
   var selection = d3.select(".player"+i).style('stroke','gray').style('stroke-width',3)
   var circle = d3.selectAll(".circleplayer"+i).style('fill','#545454').style('r',3)
  var circle = d3.select(".rectplayer"+i).style('fill','gray')
 var circle = d3.select(".textplayer"+i).style('fill','black')
	d3.selectAll('.playerPaths').style('opacity',1)
 	d3.selectAll('.playerCircles').style('opacity',1)
 }
 
 function click(d,i){
   d3.select('#legendPlayers').selectAll('g').on('mouseout',null).on('mouseover',null);
 d3.selectAll('.playerPaths').style('opacity',1)
 	d3.selectAll('.playerCircles').style('opacity',1)
    var selection = d3.select(".player"+i).style('stroke','#c0dff2').style('stroke-width',5)
   
   var circle = d3.selectAll(".circleplayer"+i).style('fill','#b5d3e5').style('r',5)
  
  var circle = d3.select(".rectplayer"+i).style('fill','#c0dff2')
 	var circle = d3.select(".textplayer"+i).style('fill','#c0dff2')
 	
 	var key = keys[i]
 	var playerKey='player'+i;
 	
 	//playerCircles
 	
 	d3.selectAll('.playerPaths').style('visibility',function(d){if(d.player!=key){return'hidden'}else{ return 'visible'}})
 	d3.selectAll('.playerCircles').style('visibility',function(d){if(d.player!=playerKey){return'hidden'}else{ return 'visible'}})
    d3.select('#legendPlayers').selectAll('g').selectAll('rect').style('fill',function(d){if (d != key){return 'gray'}else{ return '#c0dff2'}})
    d3.select('#legendPlayers').selectAll('g').selectAll('text').style('fill',function(d){if (d != key){return 'gray'}else{ return '#c0dff2'}})
 }
 
 
    
 
 function masterClick(d,i){
   console.log('one');
 	d3.selectAll('.playerPaths').style('visibility','visible')
 	d3.selectAll('.playerCircles').style('visibility','visible')
    d3.selectAll('.playerPaths').style('stroke','gray').style('stroke-width',3)
 	d3.selectAll('.playerCircles').style('fill','#545454').style('r',3)
    d3.select('#legendPlayers').selectAll('g').selectAll('text').style('fill','black')
 	d3.select('#legendPlayers').selectAll('g').selectAll('rect').style('fill','gray')
 	d3.selectAll('.playerPaths').style('opacity',1)
 	d3.selectAll('.playerCircles').style('opacity',1)
  var legend =d3.select('#legendPlayers')
  var legendG= legend.selectAll('g')
  
  legendG.on('click',click)
       			.on('mouseover',mouseover)
       			.on('mouseout',mouseout);
 }
 
  d3.select("#mainsvg").on("click",masterClick);