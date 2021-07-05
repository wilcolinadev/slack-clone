import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessagesForm";
import firebase from '../Firebase/firebase';
import Message from "./Message";
import "../components/App.css";
import Typing from './Typing';
import Skeleton from "./Skeleton";
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
        usersRef: firebase.database().ref('users'),
        typingRef: firebase.database().ref('typing'),
        typingUsers: [],
        connectedRef: firebase.database().ref('info/connected')
    };

    componentDidMount() {
        const { channel, user } = this.state;

        if (channel && user) {
            this.addListeners(channel.id);
            this.addUserStartsListeners(channel.id, user.uid);
        }
    }

    componentWillUnmount() {
        const { channel, user } = this.state;
        if (channel && user) {
            this.removeListeners(user.uid, channel.id)
        }

    }

    componentDidUpdate(prevProps, prevState) {

        if (this.messageEnd) {
            this.scrollToBottom();
        }
    }

    scrollToBottom = () => {
        this.messageEnd.scrollIntoView({ behavior: 'smooth' });
    }

    removeListeners = (userId, channelId) => {
        this.state.usersRef.child(userId)
            .child('starred')
            .off()

        this.state.currentRef.child(channelId).off()

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
        this.addTypingListeners(channelId);
    };

    addTypingListeners = channelId => {
        let typingUsers = []
        this.state.typingRef.child(channelId).on('child_added', snap => {
            if (snap.key !== this.state.user.uid) {
                typingUsers = typingUsers.concat({
                    id: snap.key,
                    name: snap.val()
                })
                this.setState({ typingUsers })
            }
        })

        this.state.typingRef.child(channelId)
            .on('child_removed', snap => {
                const index = typingUsers.find(user => user.id === snap.key)
                if (index !== -1) {
                    typingUsers = typingUsers.filter(user => user.id !== snap.key)
                    this.setState({ typingUsers })
                }
            })

        this.state.connectedRef.on('value', snap => {
            if (snap.val() === true) {
                this.state.typingRef.child(channelId)
                    .child(this.state.user.uid)
                    .onDisconnect()
                    .remove(err => {
                        if (err !== null) {
                            console.log(err);
                        }
                    })
            }
        })

    }
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
            if (message.content && (message.content.match(regex) || message.user.name.match(regex))) {
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

    displayTypingUsers = (users) => (
        users.length > 0 && users.map(user => (
            <div style={{ display: 'flex', alignItems: "center", marginBottom: "0.2em" }} key={user.id}>
                <span className="user__typing"> {user.name} is typing</span>
                <Typing />
            </div>
        ))
    )

    displayMessageSkeleton = (messagesLoading) => (
        messagesLoading ? (
            <React.Fragment>
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} />
                ))}
            </React.Fragment >
        ) : null
    )



    render() {
        const { messagesRef, messages, channel, user, progressBar, searchTerm, searchResults,
            numUniqueUsers, searchLoading, privateChannel, currentRef, isChannelStarred, typingUsers, messagesLoading } = this.state;

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
                        {this.displayMessageSkeleton(messagesLoading)}
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}

                        {this.displayTypingUsers(typingUsers)}
                        <div ref={node => (this.messageEnd = node)}>

                        </div>
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVisible={this.isProgressBarVisible}
                    IsPrivateChannel={privateChannel}
                    currentRef={currentRef}
                    primaryColor={this.props.primaryColor}
                    secondaryColor={this.props.secondaryColor}
                />
            </React.Fragment>
        );
    }
}

export default Messages;