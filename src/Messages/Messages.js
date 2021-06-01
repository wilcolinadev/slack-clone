import React, { useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessagesForm";
import firebase from '../Firebase/firebase';
import "../components/App.css";
const Messages = (props) => {

    const [messageRef, setMessageRef] = useState(firebase.database().ref('messages'));
    const [channel, setChannel] = useState(props.currentChannel);
    const [user, setUserl] = useState(props.currentUser);
    return (
        <>
            <MessagesHeader />
            <Segment >

                <Comment.Group className="messages">
                    {/*Messages*/}
                </Comment.Group>
            </Segment>

            <MessageForm
                className="messages__Form"
                messagesRef={messageRef}
                currentChannel={channel} 
                currentUser={user}/>
        </>
    )
}
export default Messages;