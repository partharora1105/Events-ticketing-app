import '../Dashboard.css';
import React, { useState, useCallback } from "react";
import { Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/esm/Button';
import Pagination from '../Pagination';
import useCurrUser from '../hooks/useCurrUser';
import useEvents from '../hooks/useEvents';
import { deleteJWT } from '../util/JWTHelpers'
import Modal from 'react-bootstrap/Modal';
import EventForm from './EventForm'
import RSVPForm from './RSVPForm'
import useDeleteEvent from './../hooks/useDeleteEvent';
import { useQueryClient } from 'react-query';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'
import logo from '../Assets/logo.png'
import Form from 'react-bootstrap/Form';
import { createContext, useContext } from 'react';
import { RSVPStatus } from '../util/EventHelpers';
import Badge from 'react-bootstrap/Badge';
import GuestList from './GuestList.js';
import SortForm from './SortForm';
import FilterForm from './FilterForm';
import EventListModal from './EventList';

const UserContext = createContext();

function filterEvents(events, categoryFilter, creatorFilter, availableFilter) {
  if (categoryFilter && categoryFilter.length != 3) {
    const categoryEvents = [];
    for (let i = 0; i < events.length; i++) {
      if (categoryFilter == events[i].category) {
        categoryEvents.push(events[i]);
      }
    }
    return categoryEvents;
  }
  if (creatorFilter) {
    const creatorEvents = [];
    for (let i = 0; i < events.length; i++) {
      if (creatorFilter == events[i].creator.email) {
        creatorEvents.push(events[i]);
      }
    }
    return creatorEvents;
  }
  if (availableFilter == "true" || availableFilter == true) {
    const availableEvents = [];
    for (let i = 0; i < events.length; i++) {
      if (events[i].will_attend.length < events[i].capacity) {
        availableEvents.push(events[i]);
      }
    }
    return availableEvents;
  }
  return events;
}

function SortByCategory (events) {

  const strAscending = events.sort((a, b) =>
    a.category > b.category ? 1 : -1,
  );
  return strAscending;
}

function SortByName(events) {
  const strAscending = events.sort((a, b) =>
    a.name > b.name ? 1 : -1
    );
  return strAscending;
}

function SortByCapacity (events) {
  const sortCapacity = events.sort((a, b) => a.capacity - b.capacity);
  return sortCapacity;
}

function FilterFormModal(props) {
  
  return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      > 
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Filter Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FilterForm {...props}></FilterForm>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}

function SortFormModal(props) {
  
  return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      > 
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Sort Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <SortForm {...props}></SortForm>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}

function GuestListModal(props) {
  
  return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      > 
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Guest List
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <GuestList data={props.data}></GuestList>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}


function EventFormModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Lets Create a Cool Expereince! &#127881;
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EventForm {...props}></EventForm>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function RSVPFormModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          RSVP to the event!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <RSVPForm data={props.data} onComplete={props.onHide}> </RSVPForm>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}


//Teacher can create/edit and attend events
function Dashboard() { 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const [categoryFilter, setCategoryFilter] = useState(urlParams.get('categoryFilter') ?? "");
  const [creatorFilter, setCreatorFilter] = useState(urlParams.get('creatorFilter') ?? "");
  const [availableFilter, setAvailableFilter] = useState(urlParams.get('availableFilter') == "true" ? true : false);
 
  
  const [categorySort, setCategorySort] = useState(false);
  const [nameSort, setNameSort] = useState(false);
  const [capacitySort, setCapacitySort] = useState(false);

  const { data: currUserData, isUserLoading, isUserError } = useCurrUser();
  const { data: eventsData, isEventsLoading, isEventsError } = useEvents();
  const [modalShow, setModalShow] = React.useState(false);
  const [sortModalShow, setSortModalShow] = React.useState(false);
  const [filterModalShow, setFilterModalShow] = React.useState(false);
  const [eventListModalShow, setEventListModalShow] = React.useState(false);


  let events = [];
  // Place the event obj's in this array
  if (eventsData) {
    events = eventsData.data;
  }

  if (categorySort == true) {
    events = SortByCategory(events);
    setCategorySort(false);
  }

  if (nameSort == true) {
    events = SortByName(events);
    setNameSort(false);
  }

  if (capacitySort == true) {
    events = SortByCapacity(events);
    setCapacitySort(false);
  }

  events = filterEvents(events, categoryFilter, creatorFilter, availableFilter);
  let currUser = currUserData ? currUserData.data : null;
  const userID = currUser ? currUser.user_id : null;

  //Pagination variables
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10); //Events per page; Sprint 2 PDF specified 10
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = events.slice(indexOfFirstRecord, 
    indexOfLastRecord);

  const nPages = Math.ceil(events.length / recordsPerPage)
  const userName = currUser && currUser.email && (currUser.email.split('@')[0] + '\'s');
  window.history.replaceState(null, "New Page Title", `/dashboard?categoryFilter=${categoryFilter}&creatorFilter=${creatorFilter}&availableFilter=${availableFilter}`)

  if (isUserLoading || isEventsLoading) {
    return (<div className="spinner-container">
    <Spinner className="post-loading-spinner" animation="border" />
  </div>)
  }

  return (
    (currUser && !isUserError && !isEventsError) ?
    <UserContext.Provider value={currUser}>
    <Container fluid className='mainConatiner'>
      <Row className='h-100'>
        <Col className='greyMargin h-100' sm={1}>
          <Row>
          <Button variant="outline-light logoutButton" onClick={() => {
          deleteJWT();
          window.location.replace("/login");
        }}>
          Logout
        </Button>
          </Row>
        </Col>
        <Col className='blackBg' sm={11}>
          <Row className='h-25'>
            <Col md={5} className='headerConatiner'>
              Whats Up {capitalizeFirstLetter(currUser.role)} &#x1f44b;
            </Col>
            <Col  md={6} className='logoContainer'>
              <Image className='logoImg' src={logo}></Image>
            </Col>
          </Row>
          <Row className='h-75'>
            <Col className='eventsContainer'>
              <Row>
                <Col sm={5}><p className='eventsHeader'>Upcoming Events &#128197;</p></Col>
                <Col sm={2}>
                  <Button onClick={() => {
                    //filter passed in through query string
                    window.location.replace(`/dashboard/map?categoryFilter=${categoryFilter}&creatorFilter=${creatorFilter}&availableFilter=${availableFilter}`);
                  }} variant="outline-light"> Map View
                  </Button>
                </Col>

                <Col sm={1}>
                  <Button variant="outline-light" onClick={() => setSortModalShow(true)}>Sort
                  </Button>
                </Col>

                <Col sm={1}>
                  <Button variant="outline-light" onClick={() => setFilterModalShow(true)}>Filter
                  </Button>
                </Col>

                <Col sm={2}>
                  <Button variant="light" onClick={() => setModalShow(true)}>Add Event
                  </Button>
                </Col>

                <Col sm={1}>
                  <Button variant="outline-light" onClick={() => setEventListModalShow(true)}> My RSVPS
                  </Button>
                </Col>
              
              </Row>
              <Row>
                  <p className="lead">
                    <u>Category:</u> {categoryFilter == "" ? "Any" : categoryFilter}, <u>Creator:</u> {creatorFilter == "" ? "Any" : creatorFilter}, <u>Availability:</u> {availableFilter ? "Open Only" : "Any"} 
                  </p>
              </Row>
                {currentRecords.map((event) => <Event event={event} isEditable={ currUser.role === 'teacher' || currUser.user_id === event.creator._id } />)}
                
                <Row><Pagination className='Pagination'
        nPages = { nPages }
        currentPage = { currentPage } 
        setCurrentPage = { setCurrentPage }
        /></Row>
            </Col>
          </Row>
        </Col>
      </Row>
      
      <EventFormModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data = {null}
        onComplete={()=>{
          setModalShow(false)
        }}
        />

      <SortFormModal
        show={sortModalShow}
        onHide={() => setSortModalShow(false)}
        data = {null}
        setCategorySort = {setCategorySort}
        setCapacitySort = {setCapacitySort}
        setNameSort= {setNameSort}
        onComplete={()=>{
          setSortModalShow(false)
        }}
        />

        <FilterFormModal 
          show={filterModalShow}
          onHide={() => setFilterModalShow(false)}
          data = {null}
          setCategoryFilter = {setCategoryFilter}
          setAvailableFilter = {setAvailableFilter}
          setCreatorFilter = {setCreatorFilter}
          onComplete={()=>{
            setFilterModalShow(false)
          }}
        />

        <EventListModal 
          show={eventListModalShow}
          onHide={() => setEventListModalShow(false)}
          events = {eventsData ? eventsData.data : []}
          userID = {userID}
          onComplete={()=>{
            setEventListModalShow(false)
          }}
        />
        
    </Container></UserContext.Provider>: <></>
  );
}



//Function is for the event list
function Event(props) {
  
  //Show more button value
  const [showMore, setShowMore] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [rsvpModalShow, setRSVPModalShow] = React.useState(false);
  const login_user = useContext(UserContext);
  const [showGuest, setShowGuest] = useState(false);
  const login_user_id = login_user && login_user.user_id;
  const login_user_email = login_user && login_user.email;
  const queryClient = useQueryClient();

  const inviteOnly = props.event.invites.length > 0;
  const loginUserInvited = props.event.invites.includes(login_user_email);
  const eventBeyondCapacity = props.event.capacity <= props.event.will_attend.length;

  

  const onSuccessfulEventUpdate = useCallback((responseData) => {
    if (!responseData.error) {
      queryClient.invalidateQueries("events");
    } else {
      alert("Unable to delete the event");
    }
  }, [queryClient]);

  const { deleteEvent } = useDeleteEvent(onSuccessfulEventUpdate, () => {
    alert("Cannot connect to server");
  });
  return (
  <>
    
    <Row className='eventRow'>
      {/* Event data, as well as show more button and behavior */}
      <Col sm={4}>
      {showMore ? <p>{props.event.name} <br></br> 
      Host: {props.event.creator.email} <br></br> 
      Location: {`${props.event.location.street_address ?? 'Not specified'} ${props.event.location.room_number ?? ''}`}<br></br> 
      Start Time/Date: {`${props.event.start_date.split("T")[0]} ${props.event.start_date.split("T")[1].slice(0,8)}`} <br></br>
      End Time/Date: {`${props.event.end_date.split("T")[0]} ${props.event.end_date.split("T")[1].slice(0,8)}`} <br></br>
      Category: {`${props.event.category}`} <br></br>
      Description: {props.event.description} <br></br>
      Capacity: {`${props.event.will_attend.length}/${props.event.capacity}`} </p>: `${props.event.name}`} 
      
      {inviteOnly ? <Badge bg="secondary ms-1">Invite Only</Badge> : <Badge bg="success ms-1">Open to Everyone</Badge> }
      {loginUserInvited && <Badge bg="primary ms-1">Your invited!</Badge> }
      {eventBeyondCapacity && <Badge bg="danger ms-1">Event At Capacity!</Badge> }
      </Col>
      <Col sm={3} className='optionalButton'>
        {props.isEditable && <Button variant="danger" onClick={() => {
          deleteEvent({eventId: props.event._id})
        }}>
            Delete
          </Button>}
          {props.isEditable && <Button variant="outline-light" onClick={() => setModalShow(true)}>
          Edit
        </Button>}
      </Col>
      <Col sm={2}>
        <Button variant="outline-light" onClick={() => setShowMore(!showMore)}>
          {showMore ? "Show less" : "Show more"}
        </Button>
      </Col>
      {/*Placeholder for now  */}
      <Col sm={2}>
        <Button variant="outline-light" onClick={() => setRSVPModalShow(true)} disabled={(inviteOnly && !loginUserInvited) || (eventBeyondCapacity && RSVPStatus(props.event, login_user_id) == null) || props.event.creator._id === login_user_id}>
          {RSVPButtonText(props.event, login_user_id)}
        </Button>
        <Button variant="outline-light show-guest-list" onClick={() => {
            setShowGuest(true)
            }}>
            Guest List
        </Button>
      </Col>
        
</Row>
    
    <EventFormModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data = {props.event}
        onComplete={()=>{
          setModalShow(false)
        }}
      />
      <RSVPFormModal
        show={rsvpModalShow}
        onHide={() => setRSVPModalShow(false)}
        data = {props.event}
        onComplete={()=>{
          setRSVPModalShow(false)
        }}
      />
      <GuestListModal
            show={showGuest}
            onHide={() => setShowGuest(false)}
            data = {props.event}
            onComplete={()=>{
              setShowGuest(false)
            }}
        />
      
  </>
  

  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function RSVPButtonText(event, login_user_id) {
  if (RSVPStatus(event, login_user_id) != null) {
    return "Change RSVP";
  } else {
    return "Add RSVP";
  }
}

export default Dashboard;
export {UserContext};
export {filterEvents};