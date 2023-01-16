import React, { Component } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground,
  Image 
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import { TextInput } from "react-native-gesture-handler";
import db from "../config";

const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book_id: "",
      student_id: "",
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false,
      //scannedData: ""
    };
  }

  getCameraPermissions = async domState => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" é verdadeiro se o usuário concedeu permissão
          status === "granted" é falso se o usuário não concedeu permissão
        */
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    if (domState === "book_id") {
      this.setState({
        //scannedData: data,
        book_id: data,
        domState: "normal",
        scanned: true
      });
    } else if (domState === "student_id") {
      this.setState({
        student_id: data,
        domState: "normal",
        scanned: true
      });
    }  
  };

  handleTransaction = () => {
    var { book_id } = this.state;
    db.collection("books")
      .doc(book_id)
      .get()
      .then(doc => {
        // usado para obter todas as informações armazenadas no documento
        console.log(doc.data())
        var book = doc.data();
        if (book.is_book_available) {
          this.initiateBookIssue();
        } else {
          this.initiateBookReturn();
        }
      });
  };
  
  initiateBookIssue = () => {
    console.log("Livro entregue para o aluno!");
    Alert.alert("Livro entregue para o aluno!");
  };
  
  initiateBookReturn = () => {
    console.log("Livro devolvido à biblioteca!");
    Alert.alert("Livro devolvido à biblioteca!");
  };
 

  render() {
    const { book_id, student_id, domState, hasCameraPermissions, scannedData, scanned } = this.state;
    if (domState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }

    return (
      <View style={styles.container}>
        <ImageBackground source={bgImage} style={styles.bgImage}>
          <View style={styles.upperContainer}>
              <Image source={appIcon} style={styles.appIcon} />
              <Image source={appName} style={styles.appName} />
          </View>
          <View style={styles.lowerContainer}>
            <View style={styles.textInputContainer}> 
              <TextInput 
                style={styles.textInput}
                placeholder={"Id Livro"}
                placeholderTextColor={"#FFFFFF"}
                value={book_id}
              />
              <TouchableOpacity
              style={styles.scanButton}
              onPress={() => this.getCameraPermissions("book_id")}
              >
                <Text style={styles.scanButtonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.textInputContainer, { marginTop: 25 }]}>
              <TextInput
                style={styles.textInput}
                placeholder={"Id Aluno"}
                placeholderTextColor={"#FFFFFF"}
                value={student_id}
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => this.getCameraPermissions("student_id")}
              >
                <Text style={styles.scanButtonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, {marginTop: 25}]}
              onPress={() => this.handleTransaction}
              >
                <Text style={styles.ButtonText}>Enviar</Text>
              </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5653D4"
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center"
  },
  textInputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF"
  },
  textInput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    color: "#FFFFFF"
  },
  scanButton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  scanButtonText: {
    fontSize: 24,
    color: "#0A0101",
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 80
  },
  appName: {
    width: 180,
    resizeMode: "contain"
  },
  button: {
    width: "43%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15
  },
  buttonText: {
    fontSize: 24,
    color: "#FFFFFF",
  },
 
});
