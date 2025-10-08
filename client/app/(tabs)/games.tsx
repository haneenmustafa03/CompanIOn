import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function GamesScreen() {
  return (
    <ImageBackground 
      source={require('../../assets/backgroundImages/Games.png')} 
      style={styles.container}
      resizeMode="stretch"
    >
      {/* <Text style={styles.text}>Games screen</Text> */}

      <View style={styles.scrollerWrapper}>
        <Text style={styles.sectionTitle}>Games: </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {[...Array(10)].map((_, i) => (
            <View key={i} style={styles.card}>
              
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 110,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
  },
  scrollerWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});