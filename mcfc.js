d3.queue()
	.defer(d3.csv,'data/mcfc2017.csv')
	.await(go)
	
	
	
 function go(err,data){
 	if(err){alert('error in getting data')}
 	
 	const keys=d3.keys(data[0]);
 	console.log(keys[keys.length-1]);
 	console.log(data);
 
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
 
 
 console.log(lineData);
 
 
 
 
 
 
 }