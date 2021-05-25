import React, { useState } from "react";
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../Firebase/firebase";


const Login = () => {

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorType, setErrorType] = useState([]);



    let formError = null;

    if (error) {
        formError = <Message error>
            <h3> Error  </h3>

            {errorType.map((el, index) => (
                <p key={index}> {el} </p>
            ))}
        </Message>

    }



    const handleSubmit = event => {
        event.preventDefault();
        if (isFormValid()) {
            setLoading(true);
            setErrorType([]);
            firebase
                .auth()
                .signInWithEmailAndPassword(userEmail, userPassword)
                .then(signedUser => {
                    console.log(signedUser);
                    setLoading(true);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                    setError(true);
                    setErrorType([...errorType, err.message]);
                })
        } else {
            setError(true);
        }
    }

    const isFormValid = (email, password) => {
        if (userEmail && userPassword) {
            return true;
        } else {
            setErrorType([...errorType, 'Make sure to fill your email and correct password'])
        }
    };
    const handleInputError = (errors, inputName) => {
        return errors.some(error => error.toLowerCase().includes(inputName)) ? 'error' : ' '
    };

    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h1" icon color="violet" textAlign="center" >
                    <Icon name="code branch" color="violet" />
                    Login to DevChat
                </Header>
                <Form size="large" onSubmit={handleSubmit}>

                    <Segment stacked >


                        <Form.Input fluid name="email"
                            icon="mail"
                            iconPosition="left"
                            placeholder="Email Address"
                            onChange={(event) => setUserEmail(event.target.value)}
                            type="email"
                            value={userEmail}
                            className={handleInputError(errorType, "email")}

                        />

                        <Form.Input
                            fluid name="password"
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            onChange={(event) => setUserPassword(event.target.value)}
                            type="password"
                            value={userPassword}
                            className={handleInputError(errorType, "password")}

                        />


                        <Button className={loading ? 'loading' : ''}
                            color="violet"
                            fluid size="large"
                            disabled={loading}
                        >
                            Submit
                        </Button>

                    </Segment>

                </Form>
                {formError}



                <Message>
                    Need to Register? <Link to="/register">  Register </Link>

                </Message>

            </Grid.Column>

        </Grid>
    )
};
export default Login;