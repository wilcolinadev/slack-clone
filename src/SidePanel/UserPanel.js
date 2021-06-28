import React, { useState } from "react";
import firebase from "../Firebase/firebase";
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
const UsersPanel = (props) => {

    const [userState, setUserState] = useState({ user: props.currentUser });
    const [isModalOpen, setModal] = useState(false)

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    const handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('Signed out'))
    }
    const dropdownOptions = () => {
        return (
            [
                {
                    key: "user",
                    text: <span> {userState.user.displayName}<strong></strong></span>,
                    disabled: true
                },
                {
                    key: "avatar",
                    text: <span onClick={openModal}>Change Avatar</span>
                },
                {
                    key: "signOut",
                    text: <span onClick={handleSignOut}>Sign Out</span>
                }
            ]
        )
    }
    const { user } = userState;

    return (
        <Grid style={{ background: props.primaryColor }}>
            <Grid.Column>
                <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
                    <Header inverted floated="left" as="h2">
                        <Icon name="code" />
                        <Header.Content> Developer Chat</Header.Content>
                    </Header>


                    <Header style={{ padding: "0.25em" }} as="h4" inverted>
                        <Dropdown trigger={
                            <span>
                                <Image src={userState.user.photoURL} spaced="right" avatar />
                                {userState.user.displayName}
                            </span>
                        } options={dropdownOptions()} />
                    </Header>
                        <Modal basic open={isModalOpen} onClose={closeModal}> 
                                <Modal.Header> 
                                        Change the Avatar 
                                </Modal.Header>
                                
                                <Modal.Content>
                                        <Input 
                                            fluid
                                            type="file"
                                            label="New Avatar"
                                            name="previewImage"
                                            />
                                            <Grid 
                                            centered 
                                            stackable 
                                            columns={2}
                                            >
                                                    <Grid.Row centered>
                                                            <Grid.Column className="ui center aligned grid">
                                                            {/*Image */}
                                                             </Grid.Column>
                                                            <Grid.Column >
                                                             {/*Image */}
                                                            </Grid.Column>
                                                    </Grid.Row>
                                            </Grid>

                                </Modal.Content>
                                        <Modal.Actions>
                                            <Button color="green" inverted>
                                                <Icon name="save" />Change Avatar
                                            </Button>

                                            <Button color="green" inverted>
                                                <Icon name="image" />Preview
                                            </Button>

                                            <Button color="red" inverted onClick={closeModal}>
                                                <Icon name="remove" /> Cancel
                                            </Button>
                                         </Modal.Actions>
                        </Modal>
                </Grid.Row>
            </Grid.Column>
        </Grid>
    )
}
const mapStatetoProps = state => ({
    currentUser: state.user.currentUser
})
export default UsersPanel;