import React, {useState} from "react";
import {Menu, Icon} from "semantic-ui-react";
import UsersPanel from "./UserPanel";

const DirectMessages = () =>{
    const [users, setUsers] = useState([]);
    return (
    <Menu.Menu className="menu">
        <Menu.Item>
            <span>
                <Icon name="mail"/> DIRECT MESSAGES 
            </span>{' '}
            ({users.length})
        </Menu.Item>
       
    </Menu.Menu>
)
}

export default DirectMessages; 