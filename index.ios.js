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

import Realm from 'realm';

export default class iwanna extends Component {
  navigatorRenderScene = (route, navigator) => {
    switch (route.id) {
      case 'loginView':
        return (<LoginView navigator={navigator} title="loginView"/>);
      case 'iwannaListView':
        return (<IwannaListView navigator={navigator} title="iwannaListView"
          data={route.accessToken} user={route.user} fbUserData={route.fbUserData}/>);
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
  navIwannaListView = (accessToken, user, fbUserData) => {
    this.props.navigator.push({
      id: 'iwannaListView',
      accessToken,
      user,
      fbUserData
    });
  };

  fetchFbUserDataAndNavToListView = (data, user) => {
    const responseInfoCallback = (error, result) => {
      if (error) {
        console.log(error)
        alert('Error fetching data: ' + error.toString());
      } else {
        console.log("This is the result" + JSON.stringify(result));
        this.navIwannaListView(data, user, result);
      }
    };

    const infoRequest = new GraphRequest(
      '/me/friends?fields=email,name,first_name,middle_name,last_name&debug=all',
      {
        accessToken: data,
      },
      responseInfoCallback
    );

    // Start the graph request.
    const fbUserData = new GraphRequestManager()
      .addRequest(infoRequest).start();

  }

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

                // login user into realm to be able to access remote database
                const user = Realm.Sync.User.registerWithProvider(
                  'http://34.200.226.165:9080',
                  'facebook',
                  accessToken.toString(),
                  (error, user) => {
                    if (!error) {
                      this.fetchFbUserDataAndNavToListView(accessToken, user);
                    } else {
                      alert("Could not login user into realm. Error " +
                        JSON.stringify(error));
                    }
                  }
                );
              };
            }
          }
        />
      </View>
    );
  };
};

const PersonSchema = {
  name: 'Person',
  properties: {
    name:     'string',
    username: 'date',
  }
};

class IwannaListView extends Component {
  render() {
    const { data } = this.props;
    return(
      <Text>Hello {JSON.stringify(data)}!</Text>
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
