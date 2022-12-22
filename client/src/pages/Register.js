import '../RegisterLogin.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'
import logo from '../Assets/logo.png'
import Form from 'react-bootstrap/Form';
import { useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import useRegister from '../hooks/useRegister';
import { setJWT, getJWT } from '../util/JWTHelpers';


function Register() {  
  const updateStoredToken = useCallback(({data}) => {
    setJWT(data.token);
    window.location.replace("/dashboard");
  }, []);

  const { registerUserToAPI } = useRegister(updateStoredToken, () => {
    alert("Invalid credentials");
  });

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    let username = e.target.username.value.trim();
    let password = e.target.password.value;
    let userType = e.target.type.value;
    if (username === null || username === "") {
      alert("Username must contain at least one non-whitespace character.")
    } else if (password === null || password === "" || password.trim() === "") {
      alert("Password must contain at least one non-whitespace character.")
    } else if (userType === null || userType === "") {
      alert("Choose a User Type");
    } else {
      registerUserToAPI({
        email: username,
        password: password,
        role: userType.toLowerCase()
      });
    }
  }, [registerUserToAPI])

  if (getJWT()) {
    return <Navigate to={`/dashboard`}></Navigate>
  }

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
            <Col className='formContainer'>
              <p className='formHeader'>Hello &#x1f44b;</p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter your cool email" name="username"/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter something awesome you'll never forget" name="password"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Label>User Type</Form.Label>
                  <Form.Check type="radio" label="Student" name="type" value="Student"/>
                  <Form.Check type="radio" label="Teacher"  name="type" value="Teacher"/>
                  <Form.Check type="radio" label="Organizer"  name="type" value="Organizer"/>
                </Form.Group>
                <Button variant="outline-light" type="submit">
                  Submit
                </Button>
                <a href='/Login'><Button variant="outline-light">
                    Login instead? &#128526;
                </Button></a>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}


export default Register;

