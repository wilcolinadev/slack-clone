import React, { useState } from "react";
import { Segment, Accordion, Header, Icon } from "semantic-ui-react";
const MetaPanel = (props) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [privateChannel, setPrivateChannel] = useState(props.isPrivateChannel)
    const defineActiveIndex = (event, tittleProps) => {
        const { index } = tittleProps;
        const newActiveIndex = activeIndex;

        const newIndex = newActiveIndex === index ? -1 : index;
        setActiveIndex(newIndex);
    }

    if (privateChannel) return null
    return (
        <Segment>
            <Header as={"h3"} attached={"top"}>
                About # channel
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
                    details
                </Accordion.Content>

                <Accordion.Title
                    active={activeIndex === 1}
                    index={1}
                    onClick={defineActiveIndex}>
                    <Icon name="dropdown" />
                    <Icon name="user circle" />
                    Channel Details
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    posters
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
                    creator
                </Accordion.Content>


            </Accordion>
        </Segment>
    )
}
export default MetaPanel;