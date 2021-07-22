import React, { useState } from "react";
import { Segment, Accordion, Header, Icon, Image } from "semantic-ui-react";
import "../components/App.css"
const MetaPanel = (props) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [privateChannel] = useState(props.isPrivateChannel)
    const [channel] = useState(props.currentChannel);

    const defineActiveIndex = (event, tittleProps) => {
        const { index } = tittleProps;
        const newActiveIndex = activeIndex;

        const newIndex = newActiveIndex === index ? -1 : index;
        setActiveIndex(newIndex);
    }





    if (privateChannel) return null
    return (
        <Segment loading={!channel} >
            <Header as={"h3"} attached={"top"}>
                {channel && channel.name}
            </Header>
            <Accordion styled attached="true">
                <Accordion.Title
                    active={activeIndex === 0}
                    index={0}
                    onClick={defineActiveIndex}>
                    <Icon name="dropdown" />
                    <Icon name="info" />
                    Channel Details
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    {channel && channel.details}
                </Accordion.Content>


                <Accordion.Title
                    active={activeIndex === 2}
                    index={2}
                    onClick={defineActiveIndex}>
                    <Icon name="dropdown" />
                    <Icon name="pencil alternate" />
                    Created By
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                    <Header as="h4">
                        <Image src={channel && channel.createdBy.avatar}
                            circular />
                        {channel && channel.createdBy.name}
                    </Header>


                </Accordion.Content>


            </Accordion>
        </Segment>
    )
}
export default MetaPanel;