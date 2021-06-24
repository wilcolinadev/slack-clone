import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessagesForm";
import firebase from '../Firebase/firebase';
import Message from "./Message";
import "../components/App.css";


class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref("messages"),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        progressBar: false,
        numUniqueUsers: 0,
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref("privateMessages"),
        currentRef: firebase.database().ref("messages"),
        isChannelStarred: false,
        usersRef: firebase.database().ref('users')
    };

    componentDidMount() {
        const { channel, user } = this.state;

        if (channel && user) {
            this.addListeners(channel.id);
            this.addUserStartsListeners(channel.id, user.uid);
        }
    }

    addUserStartsListeners = (channelId, userId) => {

        this.state.usersRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val())
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({ isChannelStarred: prevStarred })
                }
            })
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    };
    countUniqueUsers = messages => {

        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, [])

        const numUniqueUsers = uniqueUsers.length;

        this.setState({ numUniqueUsers });
    }
    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages());

    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc
        }, [])

        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 1000)

    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.state.currentRef;
        ref.child(channelId).on("child_added", snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqueUsers(loadedMessages);

        });
    };


    displayMessages = messages =>
        messages.length > 0 &&
        messages.map((message) => (
            <Message
                key={message.timeStamp}
                message={message}
                user={this.state.user}
            />
        ));

    displayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? '@' : '#'} ${channel.name}` : ' ';
    }



    isProgressBarVisible = (percent) => {
        if (percent > 0) {
            this.setState({ progressBar: true });
        }
    }

    getMessagesRef = () => {
        const { messagesRef, privateChannel, privateMessagesRef } = this.state;
        privateChannel ? this.setState({ currentRef: privateMessagesRef }) : this.setState({ messagesRef });
    }
    starChannel = () => {
        if (this.state.isChannelStarred) {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id]: {
                        name: this.state.channel.name,
                        details: this.state.channel.details,
                        createdBy: {
                            name: this.state.user.displayName,
                            avatar: this.state.user.photoURL
                        }
                    }
                });
        } else {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if (err !== null) {
                        console.log(err)
                    }
                })

        }
    }

    handleStarred = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel())
    }



    render() {
        const { messagesRef, messages, channel, user, progressBar, searchTerm, searchResults,
            numUniqueUsers, searchLoading, privateChannel, currentRef, isChannelStarred } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    channelUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    IsPrivateChannel={privateChannel}
                    handleStar={this.handleStarred}
                    isChannelStarred={isChannelStarred}
                />

                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVisible={this.isProgressBarVisible}
                    IsPrivateChannel={privateChannel}
                    currentRef={currentRef}
                />
            </React.Fragment>
        );
    }
}

export default Messages;