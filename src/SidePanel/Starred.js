import React from 'react';
import { Menu, Icon, Label } from 'semantic-ui-react';
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from '../actions';
import firebase from '../Firebase/firebase';

class Starred extends React.Component {

    state = {
        starredChannels: [],
        activeChannel: ' ',
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users')
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid)
        }
    }
    componentWillUnmount() {
        this.removeListeners(this.state.user.uid)
    }

    removeListeners = (userId) => {
        this.state.usersRef.child(userId).child('starred').off();

    }

    addListeners = (userId) => {
        this.state.usersRef.child(userId)
            .child('starred')
            .on('child_added', snap => {
                const starredChannels = {
                    id: snap.key, ...snap.val()
                }
                this.setState({ starredChannels: [...this.state.starredChannels, starredChannels] })

            })
        this.state.usersRef.child(userId)
            .child('starred')
            .on('child_removed', snap => {
                const channelToRemove = { id: snap.key, ...snap.val() }
                const filteredChannels = this.state.starredChannels.filter(channel => {
                    return channel.id !== channelToRemove.id;
                })
                this.setState({ starredChannels: filteredChannels })

            })
    }
    changeChannel = channel => {

        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    };

    displayChannels = channels =>
        channels.length > 0 &&
        channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7, color: "#fff" }}
                active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ));

    render() {
        return (
            <Menu.Menu className="Menu">
                <Menu.Item>
                    <span>
                        <Icon name="star" /> STARRED
                    </span>{" "}
                    ({this.state.starredChannels.length})
                </Menu.Item>
                {this.displayChannels(this.state.starredChannels)}
            </Menu.Menu>
        )
    }


}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);