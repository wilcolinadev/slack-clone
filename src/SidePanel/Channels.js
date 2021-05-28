import React, { useState, useEffect, useCallback } from "react";
import firebase from "../Firebase/firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../actions/index";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
const Channels = (props) => {

    const [channels, setChannels] = useState([]);
    const [IsModalOpen, setIsModalOpen] = useState(false);
    const [channelName, setChannelName] = useState("");
    const [channelDetails, setChannelDetails] = useState("");
    const [channelRef, setChannelRef] = useState(firebase.database().ref('channels'));
    const [userName, setUserName] = useState(props.currentUser)
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [activeChannel, IsActiveChannel] = useState('')


    //const setFirstChannel = useCallback(() => {

    //const firstChannel = channels[0];
    //if (isFirstLoad && channels.length > 0) {
    //  props.setCurrentChannel(firstChannel);
    // IsActiveChannel(firstChannel);
    //}
    // setIsFirstLoad(false);
    // }, [isFirstLoad, channels, props.setCurrentChannel])

    const addListeners = useCallback(() => {
        let loadedChannels = [];
        channelRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            setChannels(loadedChannels);

        })
    }, [channelRef])

    useEffect(() => {
        addListeners();

        return function removeEventListener() {
            //channelRef.off();

        }
    }, [addListeners]);



    const setActiveChannel = (channel) => {
        IsActiveChannel(channel.id)
    }


    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const changeChannel = channel => {
        IsActiveChannel(channel.id);
        props.setCurrentChannel(channel);
    }

    const addChannel = () => {
        const key = channelRef.push().key;

        const newChannel = {
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
            .then(() => {
                setChannelName('');
                setChannelDetails('');
                closeModal();
                console.log("Channel Added");
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const displayChannels = (channels) => (

        channels.length > 0 && channels.map(channel => (
            <Menu.Item

                key={channel.id}
                onClick={() => changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === activeChannel}
            >
                #{channel.name}
            </Menu.Item>
        ))

    )


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
                ({channels.length}) <Icon name="add" onClick={openModal} />
                </Menu.Item>
                {displayChannels(channels)}
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


export default connect(null, { setCurrentChannel })(Channels);