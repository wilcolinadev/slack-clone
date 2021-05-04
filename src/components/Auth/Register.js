import React, { useState } from "react";
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../Firebase/firebase";
import md5 from 'md5';

const Register = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorType, setErrorType] = useState([]);
    const [usersRef, setUserRef] = useState(firebase.database().ref("users"));

    const formValidation = () => {

        if (userName.length > 0 || userEmail.length > 0) {
            return true;
            setErrorType([]);

        } else {
            setErrorType([...errorType, 'Make sure to fill your email and name '])
        }
    };

    const passwordValidation = () => {

        if ((passwordConfirmation === userPassword) && (userPassword.length >= 6)) {
            return true;
            setErrorType([]);

        } else {
            setErrorType([...errorType, 'Password Invalid']);

        }
    };
    const saveUser = (createdUser) => {
        return usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    };


    let formError = null;

    if (error) {
        formError = <Message error>
            <h3> Error  </h3>

            {errorType.map((el, index) => (
                <p key={index}> {el} </p>
            ))}
        </Message>

    }

    const handleInputError = (errors, inputName) => {
        return errors.some(error => error.toLowerCase().includes(inputName)) ? 'error' : ' '
    };
    //
    const handleSubmit = event => {
        event.preventDefault();
        if (passwordValidation() && formValidation()) {
            setErrorType([]);
            setLoading(true);
            firebase
                .auth()
                .createUserWithEmailAndPassword(userEmail, userPassword)
                .then(createdUser => {
                    console.log(createdUser);
                    createdUser.user
                        .updateProfile({
                            displayName: userName,
                            photoURL: `http://gravatar.com/avatar/${md5(
                                createdUser.user.email
                            )}?d=identicon`
                        })
                        .then(() => {
                            saveUser(createdUser).then(() => {
                                console.log("user saved");
                                setLoading(false);
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            setError(true)
                            setErrorType([...errorType, err.message]);
                            setLoading(false);
                        });
                })
                .catch(err => {
                    console.log(err);
                    setError(true)
                    setErrorType([...errorType, err.message]);
                    setLoading(false);
                });
        } else {
            setError(true);
            console.log('Form Error');

        }
    };

    //


    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h1" icon color="orange" textAlign="center" >
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
                            className={handleInputError(errorType, "username")}
                        />

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

                        <Form.Input
                            fluid name="passwordConfirmation"
                            icon="repeat"
                            iconPosition="left"
                            placeholder="Password Confirmation"
                            onChange={(event) => setPasswordConfirmation(event.target.value)}
                            type="password"
                            value={passwordConfirmation}
                            className={handleInputError(errorType, "password")}
                        />

                        <Button className={loading ? 'loading' : ''}
                            color="orange"
                            fluid size="large"
                            disabled={loading}
                        >
                            Submit
                        </Button>

                    </Segment>

                </Form>
                {formError}



                <Message>
                    Already a user? <Link to="/login">  Login </Link>

                </Message>

            </Grid.Column>

        </Grid>
    )
};
export default Register;