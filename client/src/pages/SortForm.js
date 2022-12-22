import '../Dashboard.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCallback, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function SortForm({ data, onComplete, setCategorySort, setNameSort, setCapacitySort}) {
    //const isEditMode = !!data;
    const [sortSelected, setSortSelected] = useState("");
    //const [modalShow, setModalShow] = useState(false);

    const handleSubmit = useCallback((e) => {

        //onComplete();
        e.preventDefault();
        onComplete();
        if (sortSelected == "Category") {
            setCategorySort(true);
           
        }

        if (sortSelected == "Name") {
            setNameSort(true);
            
        }

        if (sortSelected == "Capacity") {
            setCapacitySort(true);
            
        }
        //setModalShow(false);
        //onComplete();
      }, [sortSelected])




  return (
    <div className='editForm'>
    <Form onSubmit={handleSubmit}>

    <Form.Group>
    <Dropdown onSelect={(key) => {
                    setSortSelected(key);
            }}>


      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        Sort
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="Category">Category</Dropdown.Item>
        <Dropdown.Item eventKey="Capacity">Capacity</Dropdown.Item>
        <Dropdown.Item eventKey="Name">Name</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown> 
    </Form.Group>
    <Button variant="outline-dark" type="submit">
        Submit
      </Button>



    <p> {sortSelected}</p>
    </Form>
    </div>
  );
}


export default SortForm;