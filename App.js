/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import firebase from 'react-native-firebase';

class App extends React.Component {
  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('1 : ', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log('2 : ', fcmToken);
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  };

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  };

  createNotificationListeners = () => {
    this.onUnsubscribeNotificaitonListener = firebase
      .notifications()
      .onNotification(notification => {
        firebase.notifications().displayNotification(notification);
      });
  };

  removeNotificationListeners = () => {
    this.onUnsubscribeNotificaitonListener();
  };

  componentDidMount() {
    // Build a channel
    const channel = new firebase.notifications.Android.Channel(
      'test-channel',
      'Test Channel',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('My apps test channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.removeNotificationListeners();
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Step One</Text>
                <Text style={styles.sectionDescription}>
                  Edit <Text style={styles.highlight}>App.js</Text> to change
                  this screen and then come back to see your edits.
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>See Your Changes</Text>
                <Text style={styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Debug</Text>
                <Text style={styles.sectionDescription}>
                  <DebugInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Learn More</Text>
                <Text style={styles.sectionDescription}>
                  Read the docs to discover what to do next:
                </Text>
              </View>
              <LearnMoreLinks />
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
