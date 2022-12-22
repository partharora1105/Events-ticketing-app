import '../Dashboard.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCallback, useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useQueryClient } from 'react-query';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import { getJWT } from "../util/JWTHelpers";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { UserContext } from './Dashboard';
import useRSVP from './../hooks/useRSVP';


function GuestList({data}) {
    
    const [rsvpStatus, setRSVPStatus] = useState("");
    const login_user = useContext(UserContext);
    
    return (
       <div> 
            <Dropdown onSelect={(key) => {
                setRSVPStatus(key);
            }}>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Choose List
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item eventKey="will_attend">Will Attend</Dropdown.Item>
                <Dropdown.Item eventKey="maybe">Maybe Attending</Dropdown.Item>
                <Dropdown.Item eventKey="will_not_attend">Not Attending</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown> 
            <p>{makeReadable(rsvpStatus)}</p>
            <ul>
                <ViewList data={data} listToView={rsvpStatus}></ViewList>
            </ul>
        </div>
    )

}

function ViewList({data, listToView}) {
  const queryClient = useQueryClient();
    const theList = data[listToView];
    const login_user = useContext(UserContext);
    const user_id = login_user && login_user.user_id;
    const onSuccessfulEventUpdate = useCallback((responseData) => {
      if (!responseData.error) {
        queryClient.invalidateQueries("events");
      } else {
        alert("Unable to RSVP");
      }
    }, [queryClient]);

    const { addRSVP } = useRSVP(onSuccessfulEventUpdate, () => {
      alert("Cannot connect to server");
    });
    if(theList == undefined) return;
    
    let members = theList.map((attendee) => 
      <li>
         <Row className='eventRow'>
            <Col sm={6}>
              <p>{attendee.email}</p>
            </Col>
            <Col sm={0}>
              {user_id === data.creator._id && <Button variant="danger" onClick={() => {
                addRSVP({
                  rsvpStatus: null,
                  eventID: data._id,
                  userID: attendee._id
                })
              }}>
                Remove
              </Button>}
            </Col>
        </Row>
      </li>
    )
    return (
      <>
      {members}
      {members.length == 0 && (<p>No guests for this status</p>)}
      </>
    );
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
    }
  }

export default GuestList;