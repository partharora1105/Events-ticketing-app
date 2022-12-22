import '../CampusDiscovery.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import logo from '../Assets/logo.png';
import mapboxgl, {} from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import {useState, useEffect, useRef} from "react";
import useEvents from './../hooks/useEvents';
import {filterEvents} from './Dashboard';

mapboxgl.accessToken = 'pk.eyJ1IjoicmljaGFyZHpoYW5nMTMwMyIsImEiOiJjbGFwcjhuYWwwNjgxM3ZueXVxdmM5ZGlvIn0.5yasOiVjgjtdoTu_rkxeGg';

function MapView() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-84.39646);
  const [lat, setLat] = useState(33.77444);
  const [zoom, setZoom] = useState(16);
  const { data: eventsData, isEventsLoading, isEventsError } = useEvents();


  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const categoryFilter = urlParams.get('categoryFilter');
  const creatorFilter = urlParams.get('creatorFilter');
  const availableFilter = urlParams.get('availableFilter') == "true" ? true : false ;


  // console.log(categoryFilter);
  // console.log(creatorFilter);
  // console.log(availableFilter);

  useEffect(() => {
    if (map.current || isEventsLoading || !eventsData) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom
      });
    
    let events = eventsData.data;

    events = filterEvents(events, categoryFilter, creatorFilter, availableFilter);
    console.log(events);

    for (let event of events) {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<p>${event.name} <br></br> 
        Host: ${event.creator.email} <br></br> 
        Location: ${event.location.street_address ?? 'Not specified'} ${event.location.room_number ?? ''}<br></br> 
        Start Time/Date: ${event.start_date.split("T")[0]} ${event.start_date.split("T")[1].slice(0,8)} <br></br>
        End Time/Date: ${event.end_date.split("T")[0]} ${event.end_date.split("T")[1].slice(0,8)} <br></br>
        Category: ${event.category} <br></br>
        Description: ${event.description} <br></br>
        Capacity: ${event.will_attend.length}/${event.capacity} </p>`
      );
      
      const testMarker = (new mapboxgl.Marker());
      if (event.location.coordinates.length == 2) {
        testMarker.setLngLat(event.location.coordinates).setPopup(popup).addTo(map.current);
      }
    }

    
  }, [lng, lat, zoom, isEventsLoading, eventsData]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });
  
  return (
    <Container fluid className='mainConatiner'>
      
      <Row className='h-100'>
        <Col className='greyMargin h-100' sm={2}>
          <div>
            <Button variant="outline-light" onClick={() => {
                          //filter passed in through query string
                          window.location.replace(`/dashboard?categoryFilter=${categoryFilter}&creatorFilter=${creatorFilter}&availableFilter=${availableFilter}`);
                        }}>Go Back</Button>{' '}
              <p className="lead">
                <u>Category:</u> {categoryFilter == "" ? "Any" : categoryFilter}<br /> <u>Creator:</u> {creatorFilter == "" ? "Any" : creatorFilter}<br /> <u>Availability:</u> {availableFilter ? "Open Only" : "Any"} 
              </p>
          </div>
        </Col>
        <Col className='blackBg' sm={10}>
          <Row className='h-100'>

              <div ref={mapContainer} className="map-container" style={{
                height: "100%"
              }}/>
              

          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default MapView;