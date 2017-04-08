import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
} from 'react-native-fbsdk';

export default class iwanna extends Component {
  navigatorRenderScene(route, navigator) {
    switch (route.id) {
      case 'loginView':
        return (<LoginView navigator={navigator} title="loginView"/>);
      case 'listView':
        return (<ListView navigator={navigator} title="listView"
          data={route.accessToken}/>);
    }
  };

  render() {
    return (
      <Navigator
        initialRoute={{id: 'loginView'}}
        renderScene={this.navigatorRenderScene}
      />
    );
  }
};

class LoginView extends Component {
  navListView(accessToken) {
    this.props.navigator.push({
      id: 'listView',
      accessToken
    });
  };

  render() {
    return (
      <View>
      <LoginButton
          readPermissions={["public_profile", "email", "user_friends"]}
          onLoginFinished={
            async (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                const data = await AccessToken.getCurrentAccessToken();
                const accessToken = data.accessToken;

                this.navListView(accessToken);
                // const responseInfoCallback = (error, result) => {
                //   if (error) {
                //     console.log(error)
                //     alert('Error fetching data: ' + error.toString());
                //   } else {
                //     console.log("This is the result" + JSON.stringify(result));
                //     alert('Success fetching data: ' + result.data[0]);
                //   }
                // };
                //
                // const infoRequest = new GraphRequest(
                //   '/me/friends?fields=email,name,first_name,middle_name,last_name&debug=all',
                //   {
                //     accessToken: accessToken,
                //   },
                //   responseInfoCallback
                // );
                //
                // // Start the graph request.
                // new GraphRequestManager().addRequest(infoRequest).start();
              };
            }
          }
          onLogoutFinished={() => alert("logout.")}/>
      </View>
    );
  };
};

class ListView extends Component {
  render() {
    const { data } = this.props;
    return(
      <Text>Hello {data}!</Text>
    );
  };
}

const styles = StyleSheet.create({
  loginView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

AppRegistry.registerComponent('iwanna', () => iwanna);
