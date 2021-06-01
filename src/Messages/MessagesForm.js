import React, { useState } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../Firebase/firebase";
const MessageForm = (props) => {

    const [message, setMessage] = useState('');
    const [Isloading, setIsLoading] = useState(false);
    const [channel, setChannel] = useState(props.currentChannel);
    const [user, seUser] = useState(props.currentUser);
    const [errors, setErrors] = useState([]);
    const createMessage = () => {

        const messageDetails = {
            content: message,
            timeStamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL,

            }
        }
        return messageDetails;
    }

    const sendMessage = () => {

        if (message) {
            setIsLoading(true);
            props.messagesRef
                .child(channel.id)
                .push()
                .set(createMessage())
                .then(() => {
                    setIsLoading(false);
                    setMessage("");
                    setErrors([]);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                    setErrors([...errors, err]);
                }
                )
        } else {
            setErrors([...errors, 'Add a Message'])
        }
    };

    return (
        <Segment className="message__form">
            <Input
                fluid
                name="message"
                style={{ marginBottom: "0.7em" }}
                label={<Button icon={"add"} />}
                labelPosition='left'
                placeholder="Write Your Message"
                value={message}
                onChange={(event) => (setMessage(event.target.value))}
                className={errors.some(error => error.includes('message')) ? 'error' : ''}
            />
            <Button.Group icon widths="2">
                <Button
                    color="orange"
                    content="Add Reply"
                    labelPosition="left"
                    icon="edit"
                    onClick={sendMessage}
                />
                <Button
                    color="teal"
                    content="Upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                />

            </Button.Group>
        </Segment>
    )
};

export default MessageForm;