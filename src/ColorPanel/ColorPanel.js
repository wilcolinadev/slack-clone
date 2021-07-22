import React, { useState, useEffect } from "react";
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from "semantic-ui-react";
import { SliderPicker } from 'react-color';
import firebase from "../Firebase/firebase";
import { connect } from "react-redux";
import { setColors } from "../actions";
import '../components/App.css';
const ColorPanel = (props) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [primary, setPrimary] = useState('');
    const [secondary, setSecondary] = useState('')
    const [user] = useState(props.currentUser);
    const [userColors, setUserColors] = useState([])
    const [usersRef] = useState(firebase.database().ref('users'))
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        addListeners(user.uid)
        if (user && primary && secondary) {
            addListeners(user.uid)

        }
    }, [primary, secondary])


    useEffect(() => {
        if (userColors[0]) {
            props.setColors(userColors[0].primary, userColors[0].secondary)

        }
        
    }, [userColors, user])
    const addListeners = (userId) => {
        let userColors = [];
        usersRef.child(`${userId}/colors`)
            .on("child_added", snap => {
                setUserColors([snap.val()])
            })
    }

    const handleChangePrimary = (color) => (
        setPrimary(color.hex)
    )
    const handleChangeSecondary = (color) => (
        setSecondary(color.hex)
    )



    const displayUserColors = (colors) => (
        colors.length > 0 && (
            colors.map((color, index) => (
                <React.Fragment key={index}>
                    <Divider />
                    <div
                        className={"color__container"}
                        onClick={() => props.setColors(colors[0].primary, colors[0].secondary)}>
                        <div
                            className={"color__square"}
                            style={{ background: color.primary }}>
                            <div
                                className={"color__overlay"}
                                style={{ background: color.secondary }}>

                            </div>
                        </div>
                    </div>

                </React.Fragment>
            ))
        )
    )
    const saveColors = (primary, secondary) => {
        usersRef.child(`${user.uid}/colors`)
            .push()
            .update({
                primary, secondary
            })
            .then(() => {
                console.log('colors added')
                closeModal();
            })
            .catch((err) => (
                console.log(err)
            ))
    }
    const handleSave = () => {
        if (primary && secondary) {
            saveColors(primary, secondary)
        }
    }
    const revertColors = (primary, secondary) => {
        saveColors(primary, secondary)
        props.setColors(primary, secondary)
    }

    return (
        <Sidebar
            as={Menu}
            icon="labeled"
            inverted
            vertical
            visible
            width={"very thin"}
            style={{ background: "#ABA9A9" }}

        >
            <Divider />
            <Button icon="add" size="small" color="blue" onClick={openModal} />
            <Divider />
            <Button icon="redo" size="small" color="black" onClick={() => revertColors("#000", "#eee")} />
            {displayUserColors(userColors)}
            <Modal basic open={isModalOpen} onClose={closeModal} >
                <Modal.Header>
                    Choose App Colors
                </Modal.Header>
                <Modal.Content>

                    <Segment inverted>
                        <Label content="Primary Color" />
                        <SliderPicker onChange={handleChangePrimary} color={primary} />
                    </Segment>

                    <Segment inverted>
                        <Label content="Secondary Color" />
                        <SliderPicker onChange={handleChangeSecondary} color={secondary} />
                    </Segment>




                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={handleSave}>
                        <Icon name="checkmark" /> Save Colors
                    </Button>

                    <Button color="red" inverted onClick={closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>

            </Modal>
        </Sidebar >
    )
}
export default connect(null, { setColors })(ColorPanel);