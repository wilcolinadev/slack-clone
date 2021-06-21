import React, { useState } from 'react';
import { Menu, Icon, Label } from 'semantic-ui-react';
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from '../actions';

const Starred = () => {

    const [starredChannels, setStarredChannels] = useState([])
    const [activeChannel, setActiveChannel] = useState(' ')

    const changeChannel = channel => {
        setActiveChannel(channel.id);
        setCurrentChannel(channel);
        setPrivateChannel(false);
    };

    const displayChannels = channels =>
        channels.length > 0 &&
        channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ));

    return (
        <Menu.Menu className="Menu">
            <Menu.Item>
                <span>
                    <Icon name="star" /> STARRED
                </span>{" "}
                ({starredChannels.length})
            </Menu.Item>
            {displayChannels(starredChannels)}
        </Menu.Menu>
    )
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);