 var control = new ol.control.FullScreen();


       // Holen Sie sich die aktuelle URL der Seite
       var currentURL = window.location.href;

       // Verwenden Sie die URL-API, um die Subdomäne zu extrahieren
       var urlObject = new URL(currentURL);
       var subdomain = urlObject.hostname.split('.')[0];



//console.log(subdomain)

           if(subdomain == '127'){
            //Rheinbach
              var center_start =  [354754,5610100]
              var zoom_start = 12.75;
               }

           else if(subdomain == 'Kempen'){
            //Kempen
              var center_start =  [320306.34181463916, 5693504.58883973]
              var zoom_start = 17.75;
               }
          
             else {
             //Kreis Viersen
              var center_start =   [354754,5610100]
              var zoom_start = 17.75;
             }



var projectionName = 'EPSG:25832';
proj4.defs(projectionName, '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
             

var spinner = document.getElementById("loading-spinner");
var mapElement = document.getElementById("map");



var projection25832 = new ol.proj.Projection({
                                                code: 'EPSG:25832',
                                                    // The extent is used to determine zoom level 0. Recommended values for a
                                                    // projection's validity extent can be found at https://epsg.io/.
                                                extent: [-1877994.66, 3932281.56, 1836715.13, 9440581.95],
                                                units: 'm'
                                                }); 
                 
                   var DTK25 = new ol.layer.Tile({
                                               title: 'DTK25+',
                                               opacity: 0.6,
                                               visible: false,
                                               minResolution: 10,
                                               baseLayer: false,
                                               source: new ol.source.TileWMS({
                                                        url: "https://www.wms.nrw.de/geobasis/wms_nw_dtk25", //"https://ows.terrestris.de/osm/service",
                                                        params: {
                                                               'LAYERS':"nw_dtk25_col", //"OSM-WMS", //"nw_dtk10_col", //OSM-WMS
                                                               'VERSION': '1.1.0',
                                                               'FORMAT': 'image/png',
                                                               'TILED': true,
                                                                }
                                                       })
                                               });
                                               
                                               
                    var ORTHO = new ol.layer.Tile({
                                                 title: 'ORTHO+',
                                                 
                                                 visible: false,
                                                 baseLayer: false,
                                                 source: new ol.source.TileWMS({
                                                                                 url: "https://www.wms.nrw.de/geobasis/wms_nw_dop", 
                                                                                 params: {
                                                                                        'LAYERS': "nw_dop_rgb",
                                                                                        'VERSION': '1.1.0',
                                                                                        'FORMAT': 'image/png',
                                                                                        'TILED': true,
                                                                                         }
                                                                                })
                                                 });             


                 var SRRM130 = new ol.layer.Tile({
                             name: 'SRRM130', 
                             title: "SRRM130",
                             visible: true,
                             opacity: 0.5,
                             baseLayer: false,
                             source: new ol.source.TileWMS({
                                                             url: "https://maps.kommunalagentur.nrw/geoserver/StarkregenRheinbach/wms",
                                                             params:{
                                                                 'LAYERS': ['Gruppenlayer-test:Wlvl_100a_D60_Sim12h_t0300'], 
                                                                 opacity: 1.0,
                                                                 'VERSION': '1.1.0',
                                                                 'FORMAT': 'image/png',
                                                                 'TILED': true
                                                                 }
                                                             })
                                                         });    
                                                         
                                                         
var SRRM000 = new ol.layer.Tile({
    title: 'SRRM130',
    source: new ol.source.WMTS({
        url: 'https://maps.kommunalagentur.nrw/geoserver/StarkregenRheinbach/wms',
        layer: 'StarkregenRheinbach:Gruppenlayer-test',
        matrixSet: 'EPSG:25832',
        format: 'image/png',
        projection: 'EPSG:25832',
        tileGrid: new ol.tilegrid.WMTS({
            origin: [-1877994.66, 9440581.95],
            resolutions: [/* Insert resolutions here */],
            matrixIds: [/* Insert matrix IDs here */],
        }),
        style: 'default',
    }),
});


const view = new ol.View({
                  projection: projectionName,
                  center: center_start,
                  zoom: zoom_start,
                  maxZoom: 20,
                  minZoom: 12.25,
                });
 
 
 // Attach loading handlers to layers
 //handleLayerLoading(SRRM030);
 handleLayerLoading(SRRM130);

 
// Add Layers to array              
var layers = [DTK25, ORTHO, SRRM130] 


// Initialize the map
var map = new ol.Map({
    target: 'map',
    controls: [control],
    layers: layers,
    view: view,
    });




const geocoder = new Geocoder('nominatim', {
  provider: 'osm',
  targetType: 'text-input',
  countrycodes : 'DE',
  lang: 'en',
  placeholder: 'Adresse suchen ...',
  limit: 5,
  keepOpen: true,
  defaultFlyResolution : 2,

});
  
map.addControl(geocoder);

const popup = new ol.Overlay.Popup();

  
// Listen when an address is chosen
geocoder.on('addresschosen', (evt) => {
  window.setTimeout(() => {
    popup.show(evt.coordinate, evt.address.formatted);
  }, 3000);
});


// Make sure the map resizes when the window is resized
window.addEventListener('resize', function() {
    map.updateSize();
});
