import '../CampusDiscovery.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'
import logo from '../Assets/logo.png'

function CampusDiscovery() {
  return (
    <Container fluid className='mainConatiner'>
      <Row className='h-100'>
        <Col className='greyMargin h-100' sm={1}></Col>
        <Col className='blackBg' sm={11}>
          <Row className='h-25'>
            <Col className='logoContainer'>
              <Image className='logoImg' src={logo}></Image>
            </Col>
          </Row>
          <Row className='h-75'>
            <Col className='headingContainer'>
              <p>CAMPUS</p>
              <p>DISCOVERY</p>
              <p>SERVICE</p>
              <a href='/Register'> <Button variant="outline-light">Start</Button>{' '}</a>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default CampusDiscovery;