import '../Dashboard.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCallback, useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useQueryClient } from 'react-query';
import { UserContext } from './Dashboard';
import { RSVPStatus } from '../util/EventHelpers';
import useRSVP from '../hooks/useRSVP';

function RSVPForm({data, onComplete}) {
  const user = useContext(UserContext);
  const userID = user && user.user_id;
    const [rsvpStatus, setRSVPStatus] = useState(`${RSVPStatus(data, userID) || "none"}`);
    const queryClient = useQueryClient();

    const onSuccessfulEventUpdate = useCallback((responseData) => {
      if (!responseData.error) {
        queryClient.invalidateQueries("events");
        onComplete();
      } else {
        alert("Unable to RSVP");
      }
    }, [onComplete, queryClient]);

    const { addRSVP } = useRSVP(onSuccessfulEventUpdate, () => {
      alert("Cannot connect to server");
    });

    
    
    const handleSubmit = useCallback((e) => {
      e.preventDefault();
      if (rsvpStatus === null) {
        alert("Please set an RSVP Status")
      } 
      else {
        const newRSVPStatus = rsvpStatus == "none" ? null : rsvpStatus;
        addRSVP({
            rsvpStatus: newRSVPStatus,
            eventID: data._id,
            userID
          })
        }
    }, [rsvpStatus, addRSVP, data, userID])

    return (
        <div className='rsvpForm'>
          <Form onSubmit={handleSubmit}>

          <Form.Group>
            <Form.Text>
              Current Attendees: {`${data["will_attend"].length}/${data.capacity}`} <br></br>
            </Form.Text>
            <Form.Text className="text-muted">
              RSVP Status: {makeReadable(rsvpStatus)}
            </Form.Text>
            <Dropdown onSelect={(key) => {
                    setRSVPStatus(key);
            }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Select RSVP Status
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item eventKey="none">None</Dropdown.Item>
                <Dropdown.Item eventKey="will_attend">Will Attend</Dropdown.Item>
                <Dropdown.Item eventKey="maybe">Maybe Attending</Dropdown.Item>
                <Dropdown.Item eventKey="will_not_attend">Not Attending</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown> 
          </Form.Group>
        
        
        
        <Button variant="outline-dark" type="submit">
        Submit
        </Button>
        </Form>
        
     </div> 
    )
}

function makeReadable(rsvpStat) {
  if (rsvpStat == null) {
    return;
  } else if(rsvpStat === "will_not_attend") {
    return "Will Not Attend"
  } else if(rsvpStat === "will_attend") {
    return "Will Attend"
  } else if(rsvpStat === "maybe") {
    return "Maybe"
  } else if (rsvpStat === "none") {
    return "None"
  }
  return rsvpStat
}

export default RSVPForm;