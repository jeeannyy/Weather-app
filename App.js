import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH} = Dimensions.get('window');

const API_KEY = "f297001a46a885b9ca078dd3b7090764";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
      );
      const json = await response.json();
      setDays(json.daily);
    };

    useEffect(() => {
      getWeather();
    }, []);

  return (
    <View style={styles.container}>
    <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="yellow"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  // flexDirection: "row",
                  // alignItems: "center",
                  // width: "100%",
                  // justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                 {parseFloat(day.temp.day).toFixed(0)}
                 <Text style={{marginLeft:5, fontSize:140}}>°</Text>
                </Text>
                
                {/* <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                /> */}
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>

              <Fontisto style={styles.icon}
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />

            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}        

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00b894",
    
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    
  },
  cityName: {
    fontSize: 45,
    fontWeight: "500",
    color: "#ffffff",
    marginTop: 80,
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop:20,
    paddingTop:20,
    fontWeight: "600",
    fontSize: 140,
    justifyContent: "center",
    color: "#ffffff",
    alignItems: "center",
  },
  description: {
   
    fontSize: 30,
    fontWeight: "500",
  color: "#ffffff",
  marginBottom: 30

  },
  icon: {
    marginTop:20,
    fontSize: 130,
    fontWeight: "700",
  }
});