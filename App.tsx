/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import Amplify from '@aws-amplify/core';
import {DataStore} from '@aws-amplify/datastore';
import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  FlatList,
} from 'react-native';

import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

import config from './src/aws-exports';
import {Message} from './src/models';

declare const global: {HermesInternal: null | {}};

Amplify.configure(config);

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = useCallback(async () => {
    const fetchedMessages = await DataStore.query(Message);
    setMessages(fetchedMessages);
    console.log('fetchedMessages', fetchedMessages?.length);
  }, []);

  useEffect(() => {
    fetchMessages();
    const subscription = DataStore.observe(Message).subscribe(() =>
      fetchMessages(),
    );
    return () => subscription.unsubscribe();
  }, [fetchMessages]);

  const onCreate = async () => {
    console.log('onCreate');
    const newMessage = new Message({
      title: Date.now().toString(),
      color: 'red',
    });
    await DataStore.save(newMessage);
  };

  const renderMessage = (data: Message) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text>{data.title}</Text>
        <View style={{width: 20}} />
        <Text>{data.color}</Text>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Header />
        {global.HermesInternal == null ? null : (
          <View style={styles.engine}>
            <Text style={styles.footer}>Engine: Hermes</Text>
          </View>
        )}
        <View style={styles.body}>
          <Button title={'Create'} onPress={onCreate} />
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={(item) => renderMessage(item.item)}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

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
