import '../Dashboard.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCallback, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import useAddEvent from '../hooks/useAddEvent';
import useEditEvent from '../hooks/useEditEvent';
import { useQueryClient } from 'react-query';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import Badge from 'react-bootstrap/Badge';
import { RSVPStatus } from '../util/EventHelpers';

function displayRSVPEvents (events, userID) {
    const listOfRSVPEvents = [];
    console.log(events);
    for (let i = 0; i < events.length; i++) {
        const rsvp = RSVPStatus(events[i], userID);
        if (rsvp == 'will_attend') {
          listOfRSVPEvents.push(events[i]);
        }
      }
      return listOfRSVPEvents; 
}

function RSVPEventListModal(props) {
    const RSVPEvents = displayRSVPEvents(props.events, props.userID)
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        > 
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              RSVP List
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {RSVPEvents.map((event) => <p><strong>{event.name} </strong><br></br> 
      Host: {event.creator.email} <br></br> 
      Location: {`${event.location.street_address ?? 'Not specified'} ${event.location.room_number ?? ''}`}<br></br> 
      Start Time/Date: {`${event.start_date.split("T")[0]} ${event.start_date.split("T")[1].slice(0,8)}`} <br></br>
      End Time/Date: {`${event.end_date.split("T")[0]} ${event.end_date.split("T")[1].slice(0,8)}`} <br></br>
      Category: {`${event.category}`} <br></br>
      Description: {event.description} <br></br>
      Capacity: {`${event.will_attend.length}/${event.capacity}`} 
      {checkTimeConflict(event, RSVPEvents) && <Badge bg="danger ms-1">Time Conflict!</Badge> }</p> )}

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
  }
function checkTimeConflict (event, listOfRSVPEvents) {
    
    for (let i = 0; i < listOfRSVPEvents.length; i++) {
        if(event._id == listOfRSVPEvents[i]._id) {
            continue;
        }
    
        
        const eventStartDate = new Date(event.start_date);
        const eventEndDate = new Date(event.end_date);
        const otherEventStart = new Date(listOfRSVPEvents[i].start_date);
        const otherEventEnd = new Date(listOfRSVPEvents[i].end_date);
        if((eventStartDate <= otherEventEnd) && (otherEventStart <= eventEndDate)) {
            return true;
        }
    }
    return false;
}
export default RSVPEventListModal;