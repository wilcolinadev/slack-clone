import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";
const MessagesHeader = ({ channelName, channelUsers, handleSearchChange, searchLoading, IsPrivateChannel, handleStar, isChannelStarred }) => {
    let usersDescription = "users";

    if (channelUsers < 2) {
        usersDescription = "user";
    }

    return (
        <>
            <Segment clearing>

                <Header fluid="true" as="h2" floated="left" style={{ marginBottom: "0" }}>
                    <span>
                        {channelName}
                        {!IsPrivateChannel &&
                            (
                                <Icon name={isChannelStarred ? 'star' : 'star outline'}
                                    color={isChannelStarred ? 'yellow' : 'black'}
                                    onClick={handleStar} />)
                        }
                    </span>
                    <Header.Subheader> {channelUsers} {usersDescription} </Header.Subheader>
                </Header>

                <Header floated="right">

                    <Input
                        loading={searchLoading}
                        onChange={handleSearchChange}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Messages" />
                </Header>
            </Segment>
        </>
    )
}
export default MessagesHeader;