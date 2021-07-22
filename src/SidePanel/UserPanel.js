import React, { useState, useEffect } from "react";
import firebase from "../Firebase/firebase";
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";

const UsersPanel = (props) => {

    const [userState] = useState(props.currentUser);
    const [isModalOpen, setModal] = useState(false)
    const [previewImage, setPreviewImage] = useState('');
    const [croppedImage, setCroppedImage] = useState('');
    const [blob, setBlob] = useState(null)
    const [avatarEditor, setAvatarEditor] = useState('')
    const [imageUserRef] = useState(firebase.storage().ref())
    const [userRef] = useState(firebase.auth().currentUser)
    const [usersRef] = useState(firebase.database().ref('users'))
    const [metadata] = useState({ contentType: 'image/jpeg' })
    const [uploadedCroppedImage, setUploadedCroppedImage] = useState('')

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    const setAvatar = (node) => setAvatarEditor(node);
    const handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('Signed out'))
    }
    const handleChange = (event) => {
        const file = event.target.files[0]
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file)
            reader.addEventListener('load', () => {
                setPreviewImage(reader.result)
            })
        }
    }
    const handleCropImage = () => {
        if (avatarEditor) {
            avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                setCroppedImage(imageUrl)
                setBlob(blob)
            })
        }
    }

    const uploadImage = () => {
        imageUserRef
            .child(`avatar/user/${userRef.uid}`)
            .put(blob, metadata)
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    setUploadedCroppedImage(downloadURL)
                })
            })
    }

    useEffect(() => {

        if (uploadedCroppedImage) {
            changeAvatar();
        }

    }, [uploadedCroppedImage])

    const changeAvatar = () => {
        userRef
            .updateProfile({
                photoURL: uploadedCroppedImage
            })
            .then(() => {
                console.log('photo url updated')
                closeModal()
            })
            .catch(err => {
                console.log(err)
            })
        usersRef
            .child(userState.uid)
            .update({ avatar: uploadedCroppedImage })
            .then(() => {
                console.log('user avatar updated  ')
            })
            .catch(err => {
                console.log(err)
            })
    }

    const dropdownOptions = () => {
        return (
            [
                {
                    key: "user",
                    text: <span> {userState.displayName}<strong></strong></span>,
                    disabled: true
                },
                {
                    key: "avatar",
                    text: <span onClick={openModal}>Change Avatar</span>
                },
                {
                    key: "signOut",
                    text: <span onClick={handleSignOut}>Sign Out</span>
                }
            ]
        )
    }


    return (
        <Grid style={{ background: props.primaryColor }}>
            <Grid.Column>
                <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
                    <Header inverted floated="left" as="h2">
                        <Icon name="code" />
                        <Header.Content> Developer Chat</Header.Content>
                    </Header>


                    <Header style={{ padding: "0.25em" }} as="h4" inverted>
                        <Dropdown trigger={
                            <span>
                                <Image src={userState.photoURL} spaced="right" avatar />
                                {userState.displayName}
                            </span>
                        } options={dropdownOptions()} />
                    </Header>
                    <Modal basic open={isModalOpen} onClose={closeModal}>
                        <Modal.Header>
                            Change the Avatar
                        </Modal.Header>

                        <Modal.Content>
                            <Input onChange={handleChange}
                                fluid
                                type="file"
                                label="New Avatar"
                                name="previewImage"
                            />
                            <Grid
                                centered
                                stackable
                                columns={2}
                            >
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        {previewImage && (
                                            <AvatarEditor
                                                ref={node => (setAvatar(node))}
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2} />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column >
                                        {croppedImage && (
                                            <Image
                                                style={{ margin: '3.5em auto' }}
                                                width={100}
                                                height={100}
                                                src={croppedImage}

                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && (<Button color="green" inverted onClick={uploadImage}>
                                <Icon name="save" />Change Avatar
                            </Button>)}

                            <Button color="green" inverted onClick={handleCropImage}>
                                <Icon name="image" />Preview
                            </Button>

                            <Button color="red" inverted onClick={closeModal}>
                                <Icon name="remove" /> Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Grid.Row>
            </Grid.Column>
        </Grid>
    )
}
const mapStatetoProps = state => ({
    currentUser: state.user.currentUser
})
export default UsersPanel;