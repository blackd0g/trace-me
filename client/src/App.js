import React, { Component } from 'react';
import esriLoader from 'esri-loader'
import {
  Button,
  FormGroup,
  FormControl,
  ControlLabel,
  Form,
  HelpBlock
} from 'react-bootstrap'
import logo from './logo.svg';
import './App.css';

let GraphicTemp 
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      nowLocation : null,
      lat: 0,
      long: 0,
      story: '',
      budget: 0,
      image: '',
      distance: 0,
      map: null,
      view: null,
    }
    this.updateMap = this.updateMap.bind(this)
    this.getLocation = this.getLocation.bind(this)
    this.addStory = this.addStory.bind(this)
    this.addPicture = this.addPicture.bind(this)
    this.addBudget = this.addBudget.bind(this)
    this.getLocation()
  }

  getLocation () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          nowLocation: position
        })
        this.updateMap()
        // this.state.nowLocation = position
      })
    } else { 
      console.log('not support')
    }
  }
  updateMap () {
    esriLoader.loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "dojox/charting/Chart", "dojox/charting/themes/Dollar", "dojo/domReady!"])
    .then(([Map, MapView, Graphic, Chart, theme]) => {
      GraphicTemp = Graphic
      var map = new Map({
        basemap: "streets"
      });
      let center
      let path
      if (this.state.nowLocation) {
        center = [this.state.nowLocation.coords.longitude, this.state.nowLocation.coords.latitude]
        path = [[this.state.nowLocation.coords.longitude, this.state.nowLocation.coords.latitude]]
      } else {
        center = []
        path = []
      }
      var view = new MapView({
        center: center,
        container: "viewDiv",
        map: map,
        zoom: 18
      });
    
      // First create a line geometry (this is the Keystone pipeline)

      var polyline = {
        type: "polyline",  // autocasts as new Polyline()
        paths: path
      };
    
      // Create a symbol for drawing the line
      var lineSymbol = {
        type: "simple-line",  // autocasts as SimpleLineSymbol()
        color: [226, 119, 40],
        width: 4
      };
    
      // Create an object for storing attributes related to the line
      var lineAtt = {
        costNow: 0,
        timeNow: 0,
        distance: 0
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
        symbol: lineSymbol
      });
      // Add the line graphic to the view's GraphicsLayer
      let testLat = 0
      let testLong = 0

      var point = {
        type: "point", // autocasts as new Point()
        longitude: this.state.nowLocation.coords.longitude,
        latitude: this.state.nowLocation.coords.latitude
      };

      // Create a symbol for drawing the point
      var markerSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [226, 119, 40],
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 2
        }
      };

      // Create a graphic and add the geometry and symbol to it
      var pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: lineAtt,
        popupTemplate: {  // autocasts as new PopupTemplate()
          title: "{Name}",
          content: [{
            type: "fields",
            fieldInfos: [{
              fieldName: "costNow"
            }, {
              fieldName: "timeNow"
            }, {
              fieldName: "distance"
            }]
          }],
          mediaInfos:[{ //define the bar chart
            caption: "total data",
            type:"barchart",
            value:{
              theme: "Dollar",
              fields:["costNow","timeNow","distance"]
            }
          }]
        }
      })

      this.setState({
        map: map,
        view: view,
      })

      view.graphics.addMany([polylineGraphic, pointGraphic]);

      setInterval(() => {
        view.graphics.remove(polylineGraphic);
        view.graphics.remove(pointGraphic);
        testLat += 0.00001
        this.setState({
          lat: this.state.nowLocation.coords.latitude + testLat,
          long: this.state.nowLocation.coords.longitude + testLat,
          distance: testLat * 111
        })
        path.push([this.state.nowLocation.coords.longitude + testLat, this.state.nowLocation.coords.latitude + testLat])
        polyline = {
          type: "polyline",  // autocasts as new Polyline()
          paths: path
        };
        
        polylineGraphic = new Graphic({
          geometry: polyline,
          symbol: lineSymbol
        })


        /// point 
        point = {
          type: "point", // autocasts as new Point()
          longitude: this.state.nowLocation.coords.longitude + testLat,
          latitude: this.state.nowLocation.coords.latitude + testLat
        }

        lineAtt = {
          costNow: this.state.budget,
          timeNow: lineAtt.timeNow + 1,
          distance: testLat * 111
        };

        pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: lineAtt,
          popupTemplate: {  // autocasts as new PopupTemplate()
            title: "{Name}",
            content: [{
              type: "fields",
              fieldInfos: [{
                fieldName: "costNow"
              }, {
                fieldName: "timeNow"
              }, {
                fieldName: "distance"
              }]
            }],
            mediaInfos:[{ //define the bar chart
              caption: "total data",
              type:"barchart",
              value:{
                theme: "Dollar",
                fields:["costNow","timeNow","distance"]
              }
            }]
          }
        })
        
        view.graphics.addMany([polylineGraphic, pointGraphic]);
        this.setState({
          map: map,
          view: view
        })
      } , 1000)

    })
  }
  
  addStory() {
    let point = {
      type: "point", // autocasts as new Point()
      longitude: this.state.long,
      latitude: this.state.lat
    }

    let lineAtt = {
      costNow: 0,
      timeNow: 0,
      distance: this.state.distance
    };

    let markerSymbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color: [0, 40, 120],
      outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 2
      }
    };

    let pointGraphic = new GraphicTemp({
      geometry: point,
      symbol: markerSymbol,
      attributes: lineAtt,
      popupTemplate: {  // autocasts as new PopupTemplate()
        title: "{Name}",
        content: "Story: " + this.state.story,
        mediaInfos:[{ //define the bar chart
          caption: "total data",
          type:"barchart",
          value:{
            theme: "Dollar",
            fields:["costNow","timeNow","distance"]
          }
        }]
      }
    })
    console.log(this.state.view.graphics)
    this.state.view.graphics.add(pointGraphic)
    this.setState({story: ''})
  }

  addPicture() {
    let point = {
      type: "point", // autocasts as new Point()
      longitude: this.state.long,
      latitude: this.state.lat
    }

    let lineAtt = {
      costNow: 0,
      timeNow: 0,
      distance: this.state.distance
    };

    let markerSymbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color: [240, 20, 12],
      outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 2
      }
    };

    let pointGraphic = new GraphicTemp({
      geometry: point,
      symbol: markerSymbol,
      attributes: lineAtt,
      popupTemplate: {  // autocasts as new PopupTemplate()
        title: "{Name}",
        content: [{
          type: "fields",
          fieldInfos: [{
            fieldName: "costNow"
          }, {
            fieldName: "timeNow"
          }, {
            fieldName: "distance"
          }]
        }],
        mediaInfos:[{ //define the bar chart
          caption: "total data",
          type:"barchart",
          value:{
            theme: "Dollar",
            fields:["costNow","timeNow","distance"]
          }
        }]
      }
    })
    console.log(this.state.view.graphics)
    this.state.view.graphics.add(pointGraphic)
  }

  addBudget() {
    let point = {
      type: "point", // autocasts as new Point()
      longitude: this.state.long,
      latitude: this.state.lat
    }
    let markerSymbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color: [0, 240, 20],
      outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 2
      }
    };

    let pointGraphic = new GraphicTemp({
      geometry: point,
      symbol: markerSymbol,
      popupTemplate: {  // autocasts as new PopupTemplate()
        title: "{Name}",
        content: "Cost : "+ this.state.budgetInput,
        mediaInfos:[{ //define the bar chart
          caption: "total data",
          type:"barchart",
          value:{
            theme: "Dollar",
            fields:["costNow"]
          }
        }]
      }
    })
    console.log(this.state.view.graphics)
    this.state.view.graphics.add(pointGraphic)
    this.setState({budgetInput: ''})
  }

  handleChangeStory(event) {
    console.log(this.state.story)
    this.setState({story: event.target.value})
  }
  handleChangeBudget(event) {
    console.log(this.state.budget)
    this.setState({
      budget: this.state.budget += parseInt(event.target.value)
    })
    this.setState({budgetInput: event.target.value})
  }

  componentDidMount() {
    if (this.state.nowLocation) {
      this.updateMap()
    }
  }
  
  render() {
    return (
      <div style={{ padding: '50px', border: '1px solid #ddd'}}>
        <center><h3> Trace ME</h3></center>
        <Form>
          <FormGroup controlId="formControlsTextarea">
            <ControlLabel>Your story</ControlLabel>
            <FormControl componentClass="textarea" placeholder="textarea" value={this.state.story} 
    onChange={this.handleChangeStory.bind(this)} />
          </FormGroup>
        <Button onClick={this.addStory}>
          Add your story here
        </Button>
        <br/>
        <br/>
        <Button onClick={this.addPicture} disabled>
          Add Picture
        </Button>
        <br/>
        <br/>
        <FormGroup  controlId="formControlsText">
          <ControlLabel>Budget</ControlLabel>
          <FormControl componentClass="textarea" placeholder="budget" value={this.state.budgetInput} 
    onChange={this.handleChangeBudget.bind(this)} />
        </FormGroup>
        <Button onClick={this.addBudget}>
          Add Budget
        </Button>
        </Form>
      </div>
    );
  }
}

export default App;
