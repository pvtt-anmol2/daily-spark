import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  SafeAreaView,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Well done is better than well said.", author: "Benjamin Franklin" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Anonymous" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your limitation, it's only your imagination.", author: "Anonymous" },
  { text: "Great things never come from comfort zones.", author: "Anonymous" },
  { text: "Dream it. Wish it. Do it.", author: "Anonymous" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
  { text: "Sometimes later becomes never. Do it now.", author: "Anonymous" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Anonymous" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Anonymous" },
];

const STORAGE_KEY = '@daily_spark_favorites';

function getRandomQuote(excludeIndex) {
  let index;
  do {
    index = Math.floor(Math.random() * QUOTES.length);
  } while (index === excludeIndex && QUOTES.length > 1);
  return index;
}

export default function App() {
  const [quoteIndex, setQuoteIndex] = useState(() => getRandomQuote(-1));
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) {
      // ignore read errors, start with empty favorites
    }
  };

  const saveFavorites = async (next) => {
    setFavorites(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore write errors
    }
  };

  const nextQuote = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      setQuoteIndex((prev) => getRandomQuote(prev));
    }, 150);
  };

  const currentQuote = QUOTES[quoteIndex];
  const isFavorited = favorites.some((f) => f.text === currentQuote.text);

  const toggleFavorite = () => {
    if (isFavorited) {
      saveFavorites(favorites.filter((f) => f.text !== currentQuote.text));
    } else {
      saveFavorites([...favorites, currentQuote]);
    }
  };

  const removeFavorite = (text) => {
    saveFavorites(favorites.filter((f) => f.text !== text));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>✨ Daily Spark</Text>
        <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)}>
          <Text style={styles.headerButton}>{showFavorites ? 'Home' : `❤️ ${favorites.length}`}</Text>
        </TouchableOpacity>
      </View>

      {!showFavorites ? (
        <View style={styles.content}>
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <Text style={styles.quoteText}>"{currentQuote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {currentQuote.author}</Text>
          </Animated.View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.favButton} onPress={toggleFavorite}>
              <Text style={styles.favButtonText}>{isFavorited ? '❤️ Saved' : '🤍 Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={nextQuote}>
              <Text style={styles.nextButtonText}>New Quote →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={favorites}
          keyExtractor={(item) => item.text}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No favorites yet. Tap 🤍 Save on a quote you like!</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.favItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.favItemText}>"{item.text}"</Text>
                <Text style={styles.favItemAuthor}>— {item.author}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFavorite(item.text)}>
                <Text style={styles.removeButton}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: RNStatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f0f0f0',
  },
  headerButton: {
    fontSize: 16,
    color: '#e94560',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    minHeight: 180,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  quoteText: {
    fontSize: 20,
    color: '#f0f0f0',
    lineHeight: 28,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  quoteAuthor: {
    fontSize: 15,
    color: '#e94560',
    fontWeight: '600',
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 12,
  },
  favButton: {
    backgroundColor: '#16213e',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  favButtonText: {
    color: '#f0f0f0',
    fontWeight: '600',
    fontSize: 15,
  },
  nextButton: {
    backgroundColor: '#e94560',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  favItem: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  favItemText: {
    color: '#f0f0f0',
    fontSize: 15,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  favItemAuthor: {
    color: '#e94560',
    fontSize: 13,
    fontWeight: '600',
  },
  removeButton: {
    color: '#888',
    fontSize: 18,
    paddingLeft: 12,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 15,
  },
});
