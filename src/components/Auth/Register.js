import React, { useState } from "react";
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../Firebase/firebase";
const Register = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(false);



    const formValidation = () => {

        if (userName.length > 0 || userEmail.length > 0) {
            return true;
        } else {

        }
    };

    const passwordValidation = () => {

        if ((passwordConfirmation === userPassword) && (userPassword.length >= 6)) {
            return true;
        } else {

        }
    };


    let errorMessage = null;
    if (error) {
        errorMessage = <Message error>
            <h3> Please fill out the Form Correctly  </h3>
        </Message>
    }

    const handleSubmit = (event) => {


        if (passwordValidation() && formValidation()) {

            event.preventDefault();
            firebase.auth().
                createUserWithEmailAndPassword(userEmail, userPassword).
                then(
                    createdUser => {
                        console.log(createdUser);
                    }
                ).catch(err => {
                    console.log(err);
                })
        } else {
            setError(true);
            console.log('Form Error');
        }


    };
    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h2" icon color="orange" textAlign="center" >
                    <Icon name="puzzle piece" color="orange" />
                    Register For DevChat
                </Header>
                <Form size="large" onSubmit={handleSubmit}>

                    <Segment stacked >

                        <Form.Input
                            fluid name="username"
                            icon="user"
                            iconPosition="left"
                            placeholder="Username"
                            onChange={(event) => setUserName(event.target.value)}
                            type="text"
                            value={userName}
                        />

                        <Form.Input fluid name="email"
                            icon="mail"
                            iconPosition="left"
                            placeholder="Email Address"
                            onChange={(event) => setUserEmail(event.target.value)}
                            type="email"
                            value={userEmail}
                        />

                        <Form.Input
                            fluid name="password"
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            onChange={(event) => setUserPassword(event.target.value)}
                            type="password"
                            value={userPassword}
                        />

                        <Form.Input
                            fluid name="passwordConfirmation"
                            icon="repeat"
                            iconPosition="left"
                            placeholder="Password Confirmation"
                            onChange={(event) => setPasswordConfirmation(event.target.value)}
                            type="password"
                            value={passwordConfirmation}
                        />

                        <Button
                            color="orange"
                            fluid size="large">
                            Submit
                        </Button>

                    </Segment>

                </Form>
                {errorMessage}
                <Message>
                    Already a user? <Link to="/login">  Login </Link>

                </Message>

            </Grid.Column>

        </Grid>
    )
};
export default Register;