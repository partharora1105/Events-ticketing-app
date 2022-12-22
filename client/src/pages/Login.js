import '../RegisterLogin.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'
import logo from '../Assets/logo.png'
import Form from 'react-bootstrap/Form';
import { UserContext } from '../App';
import { useCallback, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { setJWT, getJWT } from '../util/JWTHelpers';
import useLogin from './../hooks/useLogin';




function Login() {
  const updateStoredToken = useCallback(({data}) => {
    setJWT(data.token);
    window.location.replace("/dashboard");
  }, []);

  const { loginUserToAPI } = useLogin(updateStoredToken, () => {
    alert("Invalid credentials");
  });

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    let username = e.target.username.value.trim();
    let password = e.target.password.value;
    if (username === null || username === "") {
      alert("Username must contain at least one non-whitespace character.")
    } else if (password === null || password === "" || password.trim() === "") {
      alert("Password must contain at least one non-whitespace character.")
    } else {
      loginUserToAPI({
        email: username,
        password: password
      });
    }
  }, [loginUserToAPI])

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
              <p className='formHeader'>Welcome Back <br></br> Cool User! &#128526;</p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter your cool email" name="username"/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Hope you know it! (Cause no one from our team does)" name="password"/>
                </Form.Group>

                <Button variant="outline-light" type="submit">
                  Submit
                </Button>
                <a href='/Register'><Button variant="outline-light">
                    Join Instead! &#129321;
                </Button></a>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
