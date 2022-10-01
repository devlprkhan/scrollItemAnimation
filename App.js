import * as React from 'react';
import { StatusBar, FlatList, Image, Animated, Text, View, Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('screen');
import { faker } from '@faker-js/faker';

// If you want consistent results, you can set your own seed
faker.seed(10);
// Make an 30 Array or collection of 30 items and store the Data coming from faker in it!
const DATA = [...Array(30).keys()].map((_, i) => {
  return {
    key: faker.datatype.uuid(),
    image: faker.image.avatar(),
    name: faker.name.firstName(),
    jobTitle: faker.name.jobTitle(),
    email: faker.internet.email(),
  };
});

// Default Values
const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3

// Pexels.com Images for Blured BG
const BG_IMAGE = 'https://images.pexels.com/photos/1231265/pexels-photo-1231265.jpeg'

export default function App() {
  //  Keep Track of scrollY Event
  // Whenever the component is re render i'm not loosing the initial value of scrollY and it will be remain the same during component lifecycle
  const scrollY = React.useRef(new Animated.Value(0)).current

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {/* BG */}
      <Image
        source={{ uri: BG_IMAGE }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={80}
      />
      {/* User List */}
      <Animated.FlatList
        data={DATA}
        ref={scrollY}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        keyExtractor={item => item.key}
        contentContainerStyle={{
          padding: SPACING,
          paddingTop: StatusBar.currentHeight || 42
        }}
        renderItem={({ item, index }) => {

          // Input Range for scale the item card or item change his size when he hit the top notch
          const inputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 2)
          ]
          // Input range for item when they go to top notch decrease his opacity
          const opacityInputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 0.5)
          ]

          // With the top input range we do scale transition
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0]
          })
          // With the top input range of opacityInputRange we do scale transition
          const opacity = scrollY.interpolate({
            inputRange: opacityInputRange,
            outputRange: [1, 1, 1, 0]
          })

          return (
            <Animated.View
              style={{
                flexDirection: "row", padding: SPACING, marginBottom: SPACING,
                borderRadius: 16,
                backgroundColor: '#FFEBFE',
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                // For Android Shadow
                elevation: 7,

                opacity,
                transform: [{scale}]
              }}
            >
              {/* DP */}
              <Image
                source={{ uri: item.image }}
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE, marginRight: SPACING / 2 }}
              />
              <View>
                {/* Name, Job Title, Email */}
                <Text style={{ fontSize: 22, fontWeight: '700' }}>{item.name}</Text>
                <Text
                  ellipsizeMode='tail'
                  numberOfLines={1}
                  style={{ fontSize: 18, opacity: .7, width: 210 }}
                >
                  {item.jobTitle}</Text>
                <Text style={{ fontSize: 14, opacity: .8, color: 'blue' }}>{item.email}</Text>
              </View>
            </Animated.View>
          )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
