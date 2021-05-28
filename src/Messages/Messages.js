import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessagesForm";
import "../components/App.css";
const Messages = () => {
    return (
        <>
            <MessagesHeader />
            <Segment >

                <Comment.Group className="messages">
                    {/*Messages*/}
                </Comment.Group>
            </Segment>

            <MessageForm className="messages__Form" />
        </>
    )
}
export default Messages;