/**
 * Example for a Azure B2C application using a B2CClient helper class
 */

import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View, TouchableOpacity, FlatList } from 'react-native';
import type { MSALResult, MSALWebviewParams } from 'react-native-msal';
import B2CClient from './b2cClient';
import { b2cConfig, b2cScopes as scopes } from './msalConfig';
import axios from 'axios';

const b2cClient = new B2CClient(b2cConfig);

export default function App() {
  const [name, getName] = useState();
  
  const [authResult, setAuthResult] = React.useState<MSALResult | null>(null);
  const [iosEphemeralSession, setIosEphemeralSession] = React.useState(false);
  const webviewParameters: MSALWebviewParams = {
    ios_prefersEphemeralWebBrowserSession: iosEphemeralSession,
  };
  
  React.useEffect(() => {
    async function init() {
      const isSignedIn = await b2cClient.isSignedIn();
      if (isSignedIn) {
        setAuthResult(await b2cClient.acquireTokenSilent({ scopes }));
      }
    }
    init();
    
  }, []);

  const handleSignInPress = async () => {
    try {
      
      const res = await b2cClient.signIn({ scopes, webviewParameters });
      setAuthResult(res);
      
      const config = {
      
        headers: {
          Authorization: 'Bearer ' + res?.accessToken,
          'OData-Version': '4.0',
          'OData-MaxVersion': '4.0',
          'Content-Type': 'application/json; charset=utf-8',
          Prefer:
            ' odata.include-annotations=OData.Community.Display.V1.FormattedValue',
        },
      };
      axios
        .get(
          'https://orgb7413eb8.crm5.dynamics.com/api/data/v9.2/contacts?$select=fullname',
          config,
        )
        .then((response) => {
          getName(response.data.value)
        })
        .catch((error) => {
          console.log(error.response);
        });
    } catch (error) {
      console.warn(error);
    }
    
  };

  const handleAcquireTokenPress = async () => {
    try {
      const res = await b2cClient.acquireTokenSilent({ scopes });
      setAuthResult(res);
      
      
    } catch (error) {
      console.warn(error);
    }
  };

  const handleSignoutPress = async () => {
    try {
      await b2cClient.signOut();
      setAuthResult(null);
    } catch (error) {
      console.warn(error);
    }
  };
 
 
   return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        {authResult ? (
          <>
            <TouchableOpacity style={styles.button} onPress={handleAcquireTokenPress}>
              <Text>Acquire Token (Silent)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignoutPress}>
              <Text>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignInPress}>
            <Text>Sign In</Text>
          </TouchableOpacity>
        )}

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.button, styles.switchButton]}
            onPress={() => setIosEphemeralSession(!iosEphemeralSession)}
          >
            <Text>Prefer ephemeral browser session (iOS only)</Text>
            <Switch value={iosEphemeralSession} onValueChange={setIosEphemeralSession} />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.scrollView}>
        {/* <Text>{JSON.stringify(authResult, null, 2)}</Text> */}
        <FlatList
          data={name}
          keyExtractor={({id}, index) => id}
          renderItem={({item}) => <Text>{item.fullname}</Text>}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '1%',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: '1%',
    margin: '-0.5%',
  },
  button: {
    backgroundColor: 'aliceblue',
    borderWidth: 1,
    margin: '0.5%',
    padding: 8,
    width: '49%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  switchButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 4,
    margin: '0.5%',
    width: '99%',
  },
  scrollView: {
    borderWidth: 1,
    padding: 1,
  },
});
