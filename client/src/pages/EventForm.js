import '../Dashboard.css';
import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCallback, useState, useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import useAddEvent from '../hooks/useAddEvent';
import useEditEvent from '../hooks/useEditEvent';
import { useQueryClient } from 'react-query';
import Modal from 'react-bootstrap/Modal';
import MapGL from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'

function MyVerticallyCenteredModal({handleSubmit, ...props}) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to make changes to this event?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit}>Yes</Button>
        <Button  onClick={props.onHide}>No</Button>
      </Modal.Footer>
    </Modal>
  );
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoicmljaGFyZHpoYW5nMTMwMyIsImEiOiJjbGFwcjhuYWwwNjgxM3ZueXVxdmM5ZGlvIn0.5yasOiVjgjtdoTu_rkxeGg'

function EventForm({ data, onComplete }) {
  const isEditMode = !!data;
  const [name, setName] = useState(data && data.name);
  const [startDate, setStartDate] = useState(data && data.start_date.slice(0, data.start_date.length - 1));
  const [endDate, setEndDate] = useState(data && data.end_date.slice(0, data.end_date.length - 1));
  const [location, setLocation] = useState(data ? {
    street_address: data.location.street_address,
    room_number: data.location.room_number,
    coordinates: data.location.coordinates
  } : {})
  const [description, setDescription] = useState(data && data.description);
  const [capacity, setCapacity] = useState(data && data.capacity);
  const [category, setCategory] = useState(data && data.category);
  const [inviteOnly, setInviteOnly] = useState(data && data.invites.length != 0);
  const [guestList, setGuestList] = useState(data && data.invites.join(" "));
  const queryClient = useQueryClient();
  const [modalShow, setModalShow] = useState(false);

  const [viewport, setViewport] = useState({
    latitude: data ? data.location.coordinates[1] : 33.77444,
    longitude: data ? data.location.coordinates[0] : -84.39646,
    zoom: 14
  });
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      });
    },
    []
  );

  const onSuccessfulEventUpdate = useCallback((responseData) => {
    if (!responseData.error) {
      queryClient.invalidateQueries("events");
      onComplete();
      setModalShow(false);
    } else {
      alert("Unable to add or edit the event");
    }
  }, [onComplete, queryClient]);

  const { addEvent } = useAddEvent(onSuccessfulEventUpdate, () => {
    alert("Cannot connect to server");
  });

  const { editEvent } = useEditEvent(onSuccessfulEventUpdate, () => {
    alert("Cannot connect to server");
  })
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (name === null || name === "") {
      alert("Event Name must contain at least one non-whitespace character.")
    } else if (startDate === null || startDate === "") {
      alert("Start date cannot be empty")
    } else if (endDate === null || endDate === "") {
      alert("End date cannot be empty")
    } else if (description === null || description === "") {
      alert("Choose a Description");
    } else if (category === null || category === "") {
      alert("Choose a Category");
    } else if (category === null || category === "") {
      alert("Choose a Category"); 
    } else if (capacity === null) {
      alert("Please enter a capacity"); 
    } else if (!location.coordinates) {
      alert("Please choose a location.");
    } else {
      if (isEditMode) {
        editEvent({
          name,
          eventId: data._id, 
          startDate: startDate + "Z",
          endDate: endDate + "Z",
          location,
          description,
          category,
          inviteOnly,
          guestList,
          capacity
        })
      } else {
        addEvent({
          name,
          startDate: startDate + "Z",
          endDate: endDate + "Z",
          location,
          description,
          category, 
          inviteOnly,
          guestList,
          capacity
        })
      }
    }
  }, [name, startDate, endDate, location, description, category, addEvent, isEditMode, data, editEvent, inviteOnly, guestList, capacity])

  return (
    <div className='editForm'>
      <Form onSubmit={!isEditMode ? handleSubmit : (e) => {
        e.preventDefault();
        setModalShow(true);
      }}>
      <Form.Group className="mb-3" controlId="formBasicEvent">
        <Form.Label>What are we NAMEing it? &#128513;</Form.Label>
        <Form.Control type="text" placeholder="Enter name" name="eventName" value={name} onChange={(e)=>{
          setName(e.target.value)
        }}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicTime">
        <Form.Label>What time is it STARTING at? &#9200;</Form.Label>
        <Form.Control type="datetime-local" placeholder="Time" name="startDate" value={startDate} onChange={(e)=>{
        setStartDate(e.target.value)
      }}/>
        <Form.Text className="text-muted">
          Input a valid time.
        </Form.Text>
        </Form.Group>
      
      <Form.Group className="mb-3" controlId="formBasicTime">
      <Form.Label>What time is it ENDING at? &#9200;</Form.Label>
        <Form.Control type="datetime-local" placeholder="Time" name="endDate" value={endDate} onChange={(e)=>{
        setEndDate(e.target.value)
      }}/>
        <Form.Text className="text-muted">
          Input a valid time.
        </Form.Text>
      </Form.Group>

      
      <Form.Group>
        <Form.Label>What is the STREET ADDRESS? &#127968;</Form.Label>
        <MapGL
          ref={mapRef}
          {...viewport}
          width="100%"
          height="400px"
          onViewportChange={handleViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          <Geocoder
            mapRef={mapRef}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            position="top-left"
            onResult={({result}) => {
              setLocation({
                ...location,
                street_address: result.place_name,
                coordinates: result.geometry.coordinates
              })
            }}
          />
        </MapGL>
        <p className="lead">{`Chosen Street Address: ${location.street_address ?? "No location chosen"}`}</p>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="formBasicEvent">
        <Form.Label>What about a ROOM NUMBER? &#127968;</Form.Label>
        <Form.Control type="text" placeholder="Enter room number" name="roomNumber" value={location.room_number} onChange={(e)=>{
          setLocation({
            ...location,
            room_number: e.target.value
          })
      }}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicDescription">
        <Form.Label>How would you DESCRIBE it? &#128394;</Form.Label>
        <Form.Control type="description" placeholder="Description" name="description" value={description} onChange={(e)=>{
        setDescription(e.target.value)
      }}/>
        <Form.Text className="text-muted">
          Input a valid description.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCapacity">
        <Form.Label>What is the maximum number of attendees?</Form.Label>
        <Form.Control type="number" placeholder="Capacity" name="capacity" value={capacity} onChange={(e)=>{
        setCapacity(Math.max(e.target.value, 0))
      }}/>
        <Form.Text className="text-muted">
          Input a valid description.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Text className="text-muted">
          <p className="lead">
            Selected Category: {category}
          </p>
        </Form.Text>
      <Dropdown onSelect={(key) => {
        setCategory(key);
      }}>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        Category
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="Club Meeting">Club Meeting</Dropdown.Item>
        <Dropdown.Item eventKey="Info Meetings">Info Meetings</Dropdown.Item>
        <Dropdown.Item eventKey="Networking Events">Networking Events</Dropdown.Item>
        <Dropdown.Item eventKey="Social Events">Social Events</Dropdown.Item>
        <Dropdown.Item eventKey="Tutoring">Tutoring</Dropdown.Item>
        <Dropdown.Item eventKey="Study Groups">Study Groups</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown> 
    </Form.Group>

    <Form.Group>
    <Form.Check 
        type="switch"
        id="custom-switch"
        label="Invite only?"
        checked={inviteOnly}
        onChange={(e) => {
          setInviteOnly(e.target.checked);
        }}
      />
    </Form.Group>

    {inviteOnly && <Form.Group className="mb-3" controlId="formBasicEvent">
        <Form.Label>Who's on the guest list? Separate each email with a space. &#127968;</Form.Label>
        <Form.Control type="text" placeholder="Who's on the guest list? Separate each email with a space." name="guestList" value={guestList} onChange={(e)=>{
        setGuestList(e.target.value)
      }}/>
      </Form.Group>}

      <Button variant="outline-dark" type="submit">
        Submit
      </Button>
    </Form>
    <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}


export default EventForm;