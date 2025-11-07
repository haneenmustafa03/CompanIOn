import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MatchingGameProps {
  onGameComplete?: (score: number) => void;
}

interface Card {
  id: number;
  shape: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface CurrentlyFlippedCards {
  id1: number;
  shape1: string;
  id2: number;
  shape2: string;
}

export default function MatchingGame({ onGameComplete }: MatchingGameProps) {
  // Initialize cards with proper state management
  const [cards, setCards] = useState<Card[]>([
    { id: 1, shape: "circle", isFlipped: false, isMatched: false },
    { id: 2, shape: "square", isFlipped: false, isMatched: false },
    { id: 3, shape: "triangle", isFlipped: false, isMatched: false },
    { id: 4, shape: "triangle", isFlipped: false, isMatched: false },
    { id: 5, shape: "circle", isFlipped: false, isMatched: false },
    { id: 6, shape: "square", isFlipped: false, isMatched: false },
  ]);

  const [currentlyFlippedCards, setCurrentlyFlippedCards] =
    useState<CurrentlyFlippedCards>({
      id1: 0,
      shape1: "",
      id2: 0,
      shape2: "",
    });

  const [flippedCount, setFlippedCount] = useState(0);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const flipCard = (id: number) => {
    console.log("Flipping card", id);

    // Find the card being flipped
    const cardToFlip = cards.find((card) => card.id === id);
    if (!cardToFlip || cardToFlip.isFlipped || cardToFlip.isMatched) {
      return; // Don't flip if already flipped or matched
    }

    // If this is the first card being flipped
    if (flippedCount === 0) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === id ? { ...card, isFlipped: true } : card
        )
      );
      setCurrentlyFlippedCards({
        id1: id,
        shape1: cardToFlip.shape,
        id2: 0,
        shape2: "",
      });
      setFlippedCount(1);
    }
    // If this is the second card being flipped
    else if (flippedCount === 1) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === id ? { ...card, isFlipped: true } : card
        )
      );

      const updatedFlippedCards = {
        ...currentlyFlippedCards,
        id2: id,
        shape2: cardToFlip.shape,
      };
      setCurrentlyFlippedCards(updatedFlippedCards);
      setFlippedCount(2);
      setAttempts((prev) => prev + 1);

      // Check for match after a short delay
      setTimeout(() => {
        checkForMatch(updatedFlippedCards);
      }, 1000);
    }
  };

  const checkForMatch = (flippedCards: CurrentlyFlippedCards) => {
    console.log("Checking for match:", flippedCards);

    if (flippedCards.shape1 === flippedCards.shape2) {
      // Match found!
      console.log("Match found!");
      setMatches((prev) => prev + 1);

      // Mark both cards as matched
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === flippedCards.id1 || card.id === flippedCards.id2
            ? { ...card, isMatched: true }
            : card
        )
      );

      // Check if game is complete
      if (matches + 1 === 3) {
        // 3 pairs total
        console.log("Game completed!");
        if (onGameComplete) {
          onGameComplete(attempts);
        }
      }
    } else {
      // No match - flip cards back
      console.log("No match, flipping cards back");
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === flippedCards.id1 || card.id === flippedCards.id2
            ? { ...card, isFlipped: false }
            : card
        )
      );
    }

    // Reset flipped cards state
    setCurrentlyFlippedCards({
      id1: 0,
      shape1: "",
      id2: 0,
      shape2: "",
    });
    setFlippedCount(0);
  };

  const getCardImage = (card: Card) => {
    if (!card.isFlipped) {
      return require("../../assets/gameAssets/matching/back.png");
    }

    // Return different images based on shape when flipped
    switch (card.shape) {
      case "circle":
        return require("../../assets/gameAssets/matching/circle.png");
      case "square":
        return require("../../assets/gameAssets/matching/square.png");
      case "triangle":
        return require("../../assets/gameAssets/matching/triangle.png");
      default:
        return require("../../assets/gameAssets/matching/triangle.png");
    }
  };

  const resetGame = () => {
    setCards([
      { id: 1, shape: "circle", isFlipped: false, isMatched: false },
      { id: 2, shape: "square", isFlipped: false, isMatched: false },
      { id: 3, shape: "triangle", isFlipped: false, isMatched: false },
      { id: 4, shape: "triangle", isFlipped: false, isMatched: false },
      { id: 5, shape: "circle", isFlipped: false, isMatched: false },
      { id: 6, shape: "square", isFlipped: false, isMatched: false },
    ]);
    setFlippedCount(0);
    setMatches(0);
    setAttempts(0);
    setCurrentlyFlippedCards({
      id1: 0,
      shape1: "",
      id2: 0,
      shape2: "",
    });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Memory Matching Game</Text> */}

      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Matches: {matches}/3</Text>
        <Text style={styles.statText}>Attempts: {attempts}</Text>
      </View>

      <View style={styles.gameContainer}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => flipCard(card.id)}
            style={[styles.cardContainer, card.isMatched && styles.matchedCard]}
          >
            <Image source={getCardImage(card)} style={styles.image} />
            <Text style={styles.cardId}>{card.id}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => resetGame()}>
          <Text style={styles.buttonText}>Reset Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.9)",
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    color: "#5d9f4e",
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  statText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#5d9f4e",
  },
  gameContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    // gap: 10,
  },
  cardContainer: {
    alignItems: "center",
    margin: 5,
  },
  matchedCard: {
    opacity: 0.6,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#5d9f4e",
  },
  cardId: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#302638",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
});
