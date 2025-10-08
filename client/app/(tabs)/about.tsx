import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <ImageBackground 
      source={require('../../assets/backgroundImages/Library.png')} 
      style={styles.container}
      resizeMode="stretch"
    >
      <View style={styles.scrollerWrapper}>
        <Text style={styles.sectionTitle}>Lessons: </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {[...Array(10)].map((_, i) => (
            <View key={i} style={styles.card}>
              <Image
                source={require('../../assets/images/library/blueBook.png')}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>Item {i + 1}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#25292e',
    alignItems: 'center',
    // backgroundSize: 'contain',
    // backgroundPosition: 'center',
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
  row: {
    paddingHorizontal: 16,
    columnGap: 12,
  },
  card: {
    width: 140,
    height: 110,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: 120,
    height: 80,
  },
  cardText: {
    color: '#111',
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 140,
    height: 140,
    position: 'absolute',
    bottom: 10,
  },
});
