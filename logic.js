
//initialize the map 
let myMap = L.map("map", {
    center: [39.8, -96],
    zoom: 4
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

 //setting the radius based on the magnitude
  function setRadius(mag){
    return 15000*mag;
  }
    //color array to represent the depth of the earthquake
  colors = ["#008000","#90EE90","#FFFF00", "#ffae42", "#FFA500", "#FF8B00", "#FF0000"];

  //set color based on 
  function setColor(low, steps, depth){
    return colors[Math.ceil((depth-low)/steps)-1];
  }


  
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

 d3.json(url).then (function(data){
    let depths = [];
    for (i=0; i<data.features.length; i++){
        depths.push(data.features[i].geometry.coordinates[2]);
    }
  
    let low = Math.min(...depths);
    let steps = (Math.max(...depths)-low)/6;
  
    for (i=0; i<data.features.length; i++){
        //console.log(setColor(low, steps, data.features[i].geometry.coordinates[2]));
        L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
            color: setColor(low, steps, data.features[i].geometry.coordinates[2]),
            fillOpacity: 0.9,
            radius: setRadius(data.features[i].properties.mag)
        }).addTo(myMap);
    }
    var legend = L.control();
    legend.onAdd = function(map) {
        
        
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [];
        for (i =0; i<8; i++){
            grades.push(parseInt(low+i*steps));
        }
          
        for (var i = 0; i < colors.length; i++) {
         if(i<7)
          div.innerHTML +=('<i style="background:' + colors[i]  + '"></i>'+grades[i] +'&ndash;'+ grades[i + 1]+'<p>');
        else
         div.innerHTML +='<i style="background:' + colors[i]  + '"></i>'+grades[i] + '+' ;
        }
        
        div.style.fontSize = "x-small";

        return div;

        
      };
     
      legend.addTo(myMap);
  
  });