import React from "react";
import { Grid } from "semantic-ui-react";
import SidePanel from "../SidePanel/SidePanel";
import ColorPanel from "../ColorPanel/ColorPanel";
import Messages from "../Messages/Messages";
import MetaPanel from "../MetaPanel/MetaPanel";
import "./App.css";
import { connect } from "react-redux";
import { useMediaQuery } from 'react-responsive'
const App = ({ currentUser, currentChannel, isPrivateChannel, primaryColor, secondaryColor }) => {

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    })
    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px )' })
    const isTabletOrMobile = useMediaQuery({ query: '(min-width: 700px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

    return (
        <Grid columns="equal" className="app" style={{ background: secondaryColor }} >
            <ColorPanel currentUser={currentUser} key={currentUser && currentUser.name} />
            {isBigScreen && (<SidePanel
                key={currentChannel && currentUser.uid}
                currentUser={currentUser}
                primaryColor={primaryColor} />)}
            <Grid.Column style={{ marginLeft: 320 }}>
                <Messages
                    key={currentChannel && currentChannel.id}
                    currentChannel={currentChannel}
                    currentUser={currentUser}
                    isPrivateChannel={isPrivateChannel}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}

                />
            </Grid.Column>
            {isTabletOrMobile && (<Grid.Column width={4} className="metaPanel" >
                <MetaPanel

                    isPrivateChannel={isPrivateChannel}
                    key={currentChannel && currentChannel.name}
                    currentChannel={currentChannel}
                    currentUser={currentUser}

                />
            </Grid.Column>)}

        </Grid>

    )
};
const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
    primaryColor: state.colors.primaryColor,
    secondaryColor: state.colors.secondaryColor
})
export default connect(mapStateToProps)(App);