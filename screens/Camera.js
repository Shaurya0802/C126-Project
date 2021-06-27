import * as React from "react"
import { Button, View, Platform, Text } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component {
    state = {
        image: null
    }

    getPermissions = async() => {
        if (Platform.OS !== "web") {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)

            if (status !== "granted") {
                alert("Sorry, we need camera roll permissions to make this work.")
            }
        }
    }    

    pickImage = async() => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            })

            if (!result.cancelled) {
                this.setState({
                    image: result.data
                })

                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        } catch(e) {
            console.log(e)
        }
    }

    uploadImage = async(uri) => {
        const data = new FormData();
        let fileName = uri.split("/")[uri.split("/").length-1]
        let type = `image/${uri.split(".")[uri.split(".").length-1]}`

        const fileToUpload = {
            uri: uri,
            name: fileName,
            type: type
        }

        data.append("letter", fileToUpload)

        fetch("http://d3c24317447b.ngrok.io/predict", {
            method: "POST",
            body: data,
            headers: {"content-type": "multipart/form-data"}
        }).then(response => response.json())
        .then(result => {console.log("Success: ", result)})
        .catch(error => {console.log("Error: ", error)})
    }

    componentDidMount() {
        this.getPermissions()
    }

    render() {
        let {image} = this.state

        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Button 
                    title="Pick an image from camera roll"
                    onPress={this.pickImage}
                />

                <Text>Result: {}</Text>
            </View>
        );
    }
}