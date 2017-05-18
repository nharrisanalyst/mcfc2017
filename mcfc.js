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
 	
 	var  keys=d3.keys(data[0]);
 		
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
 
 	const maxY=3000;
 
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
 			
 			
 	var graph = g.selectAll('.playerPaths').data(lineData).enter().append('path').attr('class','playerPaths').attr('class',function(d,i){return 'player'+i})
 	
 	graph.attr('d',function(d){return line(d.values)}).attr('fill','none').attr('stroke','gray').attr('stroke-width',3)

    var circleData=[]
    
    lineData.forEach(function(player){
    		player.values.forEach(function(value,i){
    		
    		circleData.push({xValue:value.team, yValue:value.min, player:'player'+i})
    		
    		})
    		
    
    })
   
   
   var circles = g.selectAll('circle').data(circleData).enter().append('circle').attr('class',function(d){return d.player});
 	
 	circles.attr('cx',function(d){return scaleX(d.xValue)}).attr('cy',function(d){return scaleY(d.yValue)})
 			.attr('r',3).attr('fill','#545454');
 
 
 
 //MCFC color #c0dff2
	var legend =d3.select('#legendPlayers').append('svg').attr('width',lw).attr('height',lh);
 
	var legendG= legend.selectAll('g').data(keys).enter().append('g').attr('transform',function(d,i){return 'translate(20,'+((i*20)+30)+')'})
	
		legendG.append('rect').attr('width',10).attr('height',10).attr('fill','gray').attr('x',0).attr('y',0);
		
		legendG.append('text').attr('x',15).attr('y',10).text(function(d){return d});
 
 
 }