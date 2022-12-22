import '../Dashboard.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCallback, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';



function SelectFilterParam({filterSelect, filterParamFunc}) {
    const [filterCategory, setFilterCategory] = useState("");

    if (filterSelect == "") {
        return;
    } else if (filterSelect == "Available") {
        return;
    } else if (filterSelect == "Name") {
        return (
            <Form.Group className="mb-3" controlId="formBasicEvent">
                <Form.Label>Which creator would you like to filter by?</Form.Label>
                <Form.Control type="text" placeholder="Enter creator email" name="creator" onChange={(e)=>{
                        filterParamFunc(e.target.value);
                }}/>
            </Form.Group>
        );
    } else if (filterSelect == "Category") {
        return (
            <Dropdown onSelect={(key) => {
                filterParamFunc(key);
                setFilterCategory(key);
            }}>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Filter Category
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Club Meeting">Club Meeting</Dropdown.Item>
                    <Dropdown.Item eventKey="Info Meetings">Info Meetings</Dropdown.Item>
                    <Dropdown.Item eventKey="Networking Events">Networking Events</Dropdown.Item>
                    <Dropdown.Item eventKey="Social Events">Social Events</Dropdown.Item>
                    <Dropdown.Item eventKey="Tutoring">Tutoring</Dropdown.Item>
                    <Dropdown.Item eventKey="Study Groups">Study Groups</Dropdown.Item>
                </Dropdown.Menu>
                {filterCategory ? <p> Show all {filterCategory}</p> : <p></p>}
            </Dropdown>
        );
    }
}


function FilterForm({ data, onComplete, setCategoryFilter, setCreatorFilter, setAvailableFilter}) {
    //const isEditMode = !!data;
    const [filterSelected, setFilterSelected] = useState("");
    const [filterParam, setFilterParam] = useState("");
    const handleSubmit = useCallback((e) => {
        //onComplete();
        e.preventDefault();
        onComplete();
        if (filterSelected == "No Filter") {
            setCreatorFilter("");
            setAvailableFilter(false);
            setCategoryFilter("");
        }
        if (filterSelected == "Category") {
            setCreatorFilter("");
            setAvailableFilter(false);
            setCategoryFilter(filterParam);
        }

        if (filterSelected == "Name") {
            setAvailableFilter(false);
            setCategoryFilter("");
            setCreatorFilter(filterParam);
        }
        if (filterSelected == "Available") {
            setAvailableFilter(true);
            setCategoryFilter("");
            setCreatorFilter("");
        }
        //setModalShow(false);
        //onComplete();
      }, [filterSelected, filterParam])




  return (
    <div>

        <Form onSubmit={handleSubmit}>

        <Form.Group>
        <Dropdown onSelect={(key) => {
                    setFilterSelected(key);
                }}>


        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Select Filtering Method
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item eventKey="No Filter">No Filter</Dropdown.Item>
            <Dropdown.Item eventKey="Category">Category</Dropdown.Item>
            <Dropdown.Item eventKey="Available">Available Events</Dropdown.Item>
            <Dropdown.Item eventKey="Name">Creator Email</Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown> 
        </Form.Group>

        <p> {filterSelected} </p>
        
    
        <SelectFilterParam 
            filterSelect={filterSelected} 
            filterParamFunc = {setFilterParam}
        />
    

        {filterSelected ?
        <Button variant="outline-dark" type="submit">
            Apply
        </Button> : <></>}

        </Form>
   
    
    </div>
  );
}



export default FilterForm;