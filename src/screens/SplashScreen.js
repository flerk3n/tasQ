import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onComplete }) => {
  const [showTagline, setShowTagline] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');

  const tagline = 'built for doers, not draggers |';

  useEffect(() => {
    // Show tagline after logo animation
    const timer1 = setTimeout(() => {
      setShowTagline(true);
    }, 1500);

    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    if (showTagline) {
      let index = 0;
      const typewriterInterval = setInterval(() => {
        if (index <= tagline.length) {
          setTypewriterText(tagline.slice(0, index));
          index++;
        } else {
          clearInterval(typewriterInterval);
          // Show button after typewriter completes
          setTimeout(() => {
            setShowButton(true);
          }, 500);
        }
      }, 100);

      return () => clearInterval(typewriterInterval);
    }
  }, [showTagline]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animatable.View
          animation="fadeInDown"
          duration={1500}
          style={styles.logoContainer}
        >
          <Text style={styles.logo}>tasQ.</Text>
        </Animatable.View>

        <View style={styles.taglineContainer}>
          {showTagline && (
            <Text style={styles.tagline}>
              {typewriterText}
            </Text>
          )}
        </View>
      </View>

      {showButton && (
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-forward" size={24} color="#000" />
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  taglineContainer: {
    height: 30,
    justifyContent: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '300',
    letterSpacing: 1,
  },
  buttonContainer: {
    marginBottom: 50,
  },
  arrowButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SplashScreen; 