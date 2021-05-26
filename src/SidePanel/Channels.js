import React, { useState } from "react";
import firebase from "../Firebase/firebase";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
const Channels = (props) => {

    const [Channels, setChannels] = useState([]);
    const [IsModalOpen, setIsModalOpen] = useState(false);
    const [channelName, setChannelName] = useState("");
    const [channelDetails, setChannelDetails] = useState("");
    const [channelRef, setChannelRef] = useState(firebase.database().ref('channels'));
    const [userName,setUserName]= useState(props.currentUser)
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const addChannel = () =>{
        const key = channelRef.push().key;

        const newChannel ={
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                userName: userName.displayName,
                avatar: userName.photoURL
            }
        };

        channelRef
                    .child(key)
                    .update(newChannel)
                    .then(()=>{
                        setChannelName('');
                        setChannelDetails('');
                        closeModal();
                        console.log("Channel Added");
                    })
                    .catch((err)=>{
                            console.log(err);
                    })
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (channelName && channelDetails) {
            addChannel();
        }

    }


    return (
        <>
            <Menu.Menu style={{ paddingBottom: '2em' }} >
                <Menu.Item>
                    <span>
                        <Icon name={"exchange"} /> Channels
                </span>{" "}
                ({Channels.length}) <Icon name="add" onClick={openModal} />
                </Menu.Item>
                {/*Channels itered */}
            </Menu.Menu>

            <Modal basic open={IsModalOpen} onClose={closeModal}>
                <Modal.Header>
                    Add a Channel
            </Modal.Header>

                <Modal.Content>
                    <Form onSubmit={handleSubmit}>
                        <Form.Field>
                            <Input
                                fluid
                                label={"Name of Channel"}
                                name={"ChannelName"}
                                onChange={(event) => setChannelName(event.target.value)}
                            />

                        </Form.Field>

                        <Form.Field>
                            <Input
                                fluid
                                label={"Describe the channel"}
                                name={"ChannelDetails"}
                                onChange={(event) => setChannelDetails(event.target.value)}
                            />

                        </Form.Field>

                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color="green" inverted onClick={handleSubmit}>
                        <Icon name="checkmark" /> Add
                </Button>
                    <Button color="red" inverted onClick={closeModal}>
                        <Icon name="remove" /> Cancel
                </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
};


export default Channels;