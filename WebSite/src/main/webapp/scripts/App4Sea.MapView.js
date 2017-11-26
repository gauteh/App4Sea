/* 
 * (c) 2018 Arni Geir Sigurðsson  arni.geir.sigurdsson(at)gmail.com
 */
var App4Sea = App4Sea || {};

App4Sea.MapView = (function(){
    "use strict";
    var myMap;
    var that = {};
    var areaVertices = [
            [54.09,-32.34],
            [74.89,-32.34],
            [74.89,29.61],
            [54.09,29.61]
            ];
    var areaCenter = [67.5085683629386,-3.251953125];
    var initialZoom = 4;
    
    function onMapClick(e) {
       $("#DebugWindow").append("["+e.latlng.lat+","+e.latlng.lng+"],<br/>");
    } 

   
    function initBorderOverlay(){
        var polygon;
        var marker;
        var area;
        var location;
        var i,j;
        
                      
        polygon = L.polygon(areaVertices,{color:'white'}).addTo(myMap);                

        
    }

    
    
   
    
    //initialize maps and models when page DOM is ready..
    function init(){
        //init Leaflet map with MapBox tiles on Reykjavik
        myMap = L.map('MapContainer').setView(areaCenter,initialZoom);
        myMap.on('click', onMapClick);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXJuaWdlaXIiLCJhIjoiY2o2dGw4NmgzMHNiMDJxbzRhNjV6M3N2dSJ9.j6qbWrXD69LjlSjxZCY3mA', {
                         attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                         maxZoom: 18,
                         id: 'mapbox.streets'
                     }).addTo(myMap);
                     

                     
        update();
                     
    };
           


    function update(){
        initBorderOverlay();
        
    }
    that.Init = init;
    //that.Update = update;
    
    return that;
})();

$(document).ready(function(){
    App4Sea.MapView.Init();
});

