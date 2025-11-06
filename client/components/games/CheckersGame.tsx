import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface CheckersGameProps {
  onGameComplete?: (score: number) => void;
}

export default function CheckersGame() {
  const gameWidth = 8;
  const gameHeight = 8;

  let spaceSize = 4;

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
    isBlack: boolean;
  } | null>(null);
  ``;

  const [board, setBoard] = useState(() =>
    Array.from({ length: gameHeight }, (_, row) =>
      Array.from({ length: gameWidth }, (_, col) => ({
        row,
        col,
        isBlack: (row + col) % 2 === 0,
        isSelected: false,
      }))
    )
  );
  const cellStyles = StyleSheet.create({
    cell: {
      width: gameWidth * spaceSize,
      height: gameHeight * spaceSize,
      borderWidth: 1,
      borderColor: "#000",
      backgroundColor: "#5d9f4e",
    },
  });

  const handleCellPress = (row: number, col: number) => {
    setBoard((prev) =>
      prev.map((r, rIdx) =>
        r.map((c, cIdx) =>
          rIdx === row && cIdx === col ? { ...c, isSelected: !c.isSelected } : c
        )
      )
    );
    console.log("selectedCell", selectedCell);
    setSelectedCell({ row, col, isBlack: board[row][col].isBlack });
  };

  return (
    <View style={styles.boardContainer}>
      {board.map((row) => (
        <View key={`row-${row[0]?.row}`} style={styles.boardRow}>
          {row.map((cell) => (
            <View
              key={`cell-${cell.row}-${cell.col}`}
              style={[
                cellStyles.cell,
                { backgroundColor: cell.isBlack ? "black" : "#fff" },
              ]}
            >
              {cell.isBlack ? (
                cell.row === 0 || cell.row === 1 || cell.row === 2 ? (
                  <View
                    // onPress={() => handleCellPress(cell.row, cell.col)}
                    style={[
                      cellStyles.cell,
                      {
                        backgroundColor: "red",
                        width: "75%",
                        height: "75%",
                        borderRadius: 100,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "12.5%",
                        marginLeft: "12.5%",
                        marginRight: "12.5%",
                        marginBottom: "12.5%",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {cell.row}
                    </Text>
                  </View>
                ) : cell.row === 5 || cell.row === 6 || cell.row === 7 ? (
                  <Pressable
                    onPress={() => handleCellPress(cell.row, cell.col)}
                  >
                    <View
                      style={[
                        cellStyles.cell,
                        {
                          backgroundColor:
                            cell.row === selectedCell?.row &&
                            cell.col === selectedCell?.col
                              ? "lightblue"
                              : "white",
                          width: "75%",
                          height: "75%",
                          borderRadius: 100,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "12.5%",
                          marginLeft: "12.5%",
                          marginRight: "12.5%",
                          marginBottom: "12.5%",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                      >
                        {cell.row}
                      </Text>
                    </View>
                  </Pressable>
                ) : null
              ) : null}
              {/* {cell.isBlack ? "Black" : "White"} */}
            </View>
          ))}
          {/* console.log(cellStyles.cell); */}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  boardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  boardCell: {
    // width: 30,
    // height: 30,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#5d9f4e",
  },
});
