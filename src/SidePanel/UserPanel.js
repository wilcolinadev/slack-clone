import React, { useState } from "react";
import firebase from "../Firebase/firebase";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
const UsersPanel = (props) => {

    const [userState, setUserState] = useState({ user: props.currentUser });


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
                    text: <span>Change Avatar</span>
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
        <Grid style={{ background: "#4c3c4c" }}>
            <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
                <Header inverted floated="left" as="h2">
                    <Icon name="code" />
                    <Header.Content> Developer Chat</Header.Content>
                </Header>
            </Grid.Row>

            <Header style={{ padding: "0.25em" }} as="h4" inverted>
                <Dropdown trigger={
                    <span>
                        <Image src={userState.user.photoURL} spaced="right" avatar />
                        {userState.user.displayName}
                    </span>
                } options={dropdownOptions()} />
            </Header>
        </Grid>
    )
}
const mapStatetoProps = state => ({
    currentUser: state.user.currentUser
})
export default UsersPanel;