import * as React from 'react';
import { loadModules } from 'react-arcgis';

export default class BermudaTriangle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            graphic: null
        };
    }

    render() {
        return null;
    }

    componentWillMount() {
        loadModules(['esri/Graphic']).then(([ Graphic ]) => {
            // // Create a polygon geometry
            // const polygon = {
            //     type: "polygon", // autocasts as new Polygon()
            //     rings: [
            //     [-64.78, 32.3],
            //     [-66.07, 18.45],
            //     [-80.21, 25.78],
            //     [-64.78, 32.3]
            //     ]
            // };

            // // Create a symbol for rendering the graphic
            // const fillSymbol = {
            //     type: "simple-fill", // autocasts as new SimpleFillSymbol()
            //     color: [227, 139, 79, 0.8],
            //     outline: { // autocasts as new SimpleLineSymbol()
            //     color: [255, 255, 255],
            //     width: 1
            //     }
            // };
            

            // // Add the geometry and symbol to a new graphic
            // const graphic = new Graphic({
            //     geometry: polygon,
            //     symbol: fillSymbol
            // });

            // this.setState({ graphic });
            // this.props.view.graphics.add(graphic);
            require([
              "esri/Map",
              "esri/PopupTemplate",
              "esri/views/MapView",
              "esri/Graphic",
              "esri/geometry/Point",
              "esri/geometry/Polyline",
              "esri/geometry/Polygon",
              "esri/symbols/SimpleMarkerSymbol",
              "esri/symbols/SimpleLineSymbol",
              "esri/symbols/SimpleFillSymbol",
              "dojo/domReady!"
            ], function(
              Map, PopupTemplate, MapView,
              Graphic, Point, Polyline, Polygon,
              SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol
            ) {
        
              var map = new Map({
                basemap: "streets"
              });
        
              var view = new MapView({
                center: [100.487, 13.652],
                container: "viewDiv",
                map: map,
                zoom: 18
              });
        
              /**********************
               * Create a point graphic
               **********************/
        
              // First create a point geometry (this is the location of the Titanic)
              var point = new Point({
                longitude: -49.97,
                latitude: 41.73
              });
        
              // Create a symbol for drawing the point
              var markerSymbol = new SimpleMarkerSymbol({
                color: [226, 119, 40],
                outline: { // autocasts as new SimpleLineSymbol()
                  color: [255, 255, 255],
                  width: 2
                }
              });
        
              // Create a graphic and add the geometry and symbol to it
              var pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
              });
        
              /*************************
               * Create a polyline graphic
               *************************/
        
              // First create a line geometry (this is the Keystone pipeline)
              var polyline = new Polyline({
                paths: [
                  [-111.30, 52.68],
                  [-98, 49.5],
                  [-93.94, 29.89]
                ]
              });
        
              // Create a symbol for drawing the line
              var lineSymbol = new SimpleLineSymbol({
                color: [226, 119, 40],
                width: 4
              });
        
              // Create an object for storing attributes related to the line
              var lineAtt = {
                Name: "Keystone Pipeline",
                Owner: "TransCanada",
                Length: "3,456 km"
              };
        
              /*******************************************
               * Create a new graphic and add the geometry, 
               * symbol, and attributes to it. You may also 
               * add a simple PopupTemplate to the graphic. 
               * This allows users to view the graphic's 
               * attributes when it is clicked.
               ******************************************/
              var polylineGraphic = new Graphic({
                geometry: polyline,
                symbol: lineSymbol,
                attributes: lineAtt,
                popupTemplate: new PopupTemplate({
                  title: "{Name}",
                  content: "{*}"
                })
              });
        
              /************************
               * Create a polygon graphic
               ************************/
        
              // Create a polygon geometry
              var polygon = new Polygon({
                rings: [
                  [-64.78, 32.3],
                  [-66.07, 18.45],
                  [-80.21, 25.78],
                  [-64.78, 32.3]
                ]
              });
        
              // Create a symbol for rendering the graphic
              var fillSymbol = new SimpleFillSymbol({
                color: [227, 139, 79, 0.8],
                outline: { // autocasts as new SimpleLineSymbol()
                  color: [255, 255, 255],
                  width: 1
                }
              });
        
              // Add the geometry and symbol to a new graphic
              var polygonGraphic = new Graphic({
                geometry: polygon,
                symbol: fillSymbol
              });
        
              // Add the graphics to the view's graphics view
              view.then(function() {
                view.graphics.addMany([pointGraphic, polylineGraphic,
                  polygonGraphic
                ]);
              });
            });
        }).catch((err) => console.error(err));
    }

    componentWillUnmount() {
        this.props.view.graphics.remove(this.state.graphic);
    }
}