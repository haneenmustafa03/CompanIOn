import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";

interface CheckersGameProps {
  onGameComplete?: (winner: "human" | "ai" | "draw") => void;
}

type Player = "human" | "ai";

type Piece = { owner: Player; king: boolean } | null;

type Board = Piece[][];

const BOARD_SIZE = 8;
const SCREEN_WIDTH = Dimensions.get("window").width;
const BOARD_PADDING = 20;
const SQUARE_SIZE = Math.floor((SCREEN_WIDTH - BOARD_PADDING * 2) / BOARD_SIZE);

function cloneBoard(b: Board) {
  return b.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function initBoard(): Board {
  const b: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if ((r + c) % 2 === 1) {
        if (r < 3) b[r][c] = { owner: "ai", king: false };
        else if (r > 4) b[r][c] = { owner: "human", king: false };
      }
    }
  }
  return b;
}

function inBounds(r: number, c: number) {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
}

function computeValidMoves(
  board: Board,
  r: number,
  c: number
): Array<{ r: number; c: number; captures: Array<[number, number]> }> {
  const piece = board[r][c];
  if (!piece) return [];
  // first compute captures (multi-step)
  const captures = computeCaptures(board, r, c);
  if (captures.length > 0)
    return captures.map((seq) => ({
      r: seq[0][0],
      c: seq[0][1],
      captures: seq.map((s) => [s[2][0], s[2][1]] as [number, number]),
    }));

  // else normal moves
  const dirs = getDirections(piece);
  const moves: Array<{
    r: number;
    c: number;
    captures: Array<[number, number]>;
  }> = [];
  dirs.forEach(([dr, dc]) => {
    const nr = r + dr;
    const nc = c + dc;
    if (inBounds(nr, nc) && !board[nr][nc])
      moves.push({ r: nr, c: nc, captures: [] });
  });
  return moves;
}

function getDirections(piece: Piece) {
  if (!piece) return [] as [number, number][];
  if (piece.king)
    return [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ] as [number, number][];
  return piece.owner === "human"
    ? [
        [-1, -1],
        [-1, 1],
      ]
    : [
        [1, -1],
        [1, 1],
      ];
}

// compute capture sequences: returns array of sequences where each sequence is an array of tuples [toR,toC, capturedPos]
function computeCaptures(
  board: Board,
  r: number,
  c: number
): Array<Array<[number, number, [number, number]]>> {
  const piece = board[r][c];
  if (!piece) return [];
  const pieceOwner = piece.owner;
  const pieceKing = piece.king;
  const results: Array<Array<[number, number, [number, number]]>> = [];

  function getDirsForPiece(owner: Player, king: boolean) {
    if (king)
      return [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ] as [number, number][];
    return owner === "human"
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ];
  }

  function dfs(
    curBoard: Board,
    cr: number,
    cc: number,
    path: Array<[number, number, [number, number]]>,
    visitedCaptures: Set<string>
  ) {
    const dirs = getDirsForPiece(pieceOwner, pieceKing);
    let found = false;
    for (const [dr, dc] of dirs) {
      const mr = cr + dr;
      const mc = cc + dc;
      const jr = cr + 2 * dr;
      const jc = cc + 2 * dc;
      if (!inBounds(jr, jc)) continue;
      if (!inBounds(mr, mc)) continue;
      const mid = curBoard[mr][mc];
      if (mid && mid.owner !== pieceOwner && !curBoard[jr][jc]) {
        const capKey = `${mr},${mc}`;
        if (visitedCaptures.has(capKey)) continue; // avoid re-capturing same piece
        found = true;
        const nb = cloneBoard(curBoard);
        nb[cr][cc] = null;
        nb[mr][mc] = null;
        nb[jr][jc] = { owner: pieceOwner, king: pieceKing };
        const newPath = path.concat([
          [jr, jc, [mr, mc]] as [number, number, [number, number]],
        ]);
        const newVisited = new Set(visitedCaptures);
        newVisited.add(capKey);
        dfs(nb, jr, jc, newPath, newVisited);
      }
    }
    if (!found && path.length > 0) {
      results.push(path);
    }
  }

  dfs(board, r, c, [], new Set());
  return results;
}

function computeCapturesFrom(
  board: Board,
  r: number,
  c: number
): Array<[number, number, Array<[number, number]>]> {
  const seqs = computeCaptures(board, r, c);
  return seqs.map((seq) => [seq[0][0], seq[0][1], seq.map((s) => s[2])]);
}

function getAllCaptures(board: Board, owner: Player) {
  const list: Array<{
    sr: number;
    sc: number;
    tr: number;
    tc: number;
    captures: Array<[number, number]>;
  }> = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.owner === owner) {
        const caps = computeCaptures(board, r, c);
        caps.forEach((seq) => {
          list.push({
            sr: r,
            sc: c,
            tr: seq[0][0],
            tc: seq[0][1],
            captures: seq.map((s) => s[2]),
          });
        });
      }
    }
  }
  return list;
}

function getAllMoves(board: Board, owner: Player) {
  const moves: Array<{
    sr: number;
    sc: number;
    tr: number;
    tc: number;
    captures: Array<[number, number]>;
  }> = [];
  const allCaptures = getAllCaptures(board, owner);
  if (allCaptures.length > 0) return allCaptures;
  // else normal moves
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.owner === owner) {
        const dirs = getDirections(p);
        dirs.forEach(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          if (inBounds(nr, nc) && !board[nr][nc])
            moves.push({ sr: r, sc: c, tr: nr, tc: nc, captures: [] });
        });
      }
    }
  }
  return moves;
}

function checkGameOver(board: Board): "human" | "ai" | "draw" | null {
  const humanMoves = getAllMoves(board, "human");
  const aiMoves = getAllMoves(board, "ai");
  const humanPieces = board
    .flat()
    .filter((p) => p && p.owner === "human").length;
  const aiPieces = board.flat().filter((p) => p && p.owner === "ai").length;
  if (humanPieces === 0 || humanMoves.length === 0) return "ai";
  if (aiPieces === 0 || aiMoves.length === 0) return "human";
  return null;
}

const styles = StyleSheet.create({
  container: {
    top: 20,
    padding: BOARD_PADDING,
    alignItems: "center",
    marginTop: -20,
  },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  board: {
    width: SQUARE_SIZE * BOARD_SIZE,
    height: SQUARE_SIZE * BOARD_SIZE,
    // borderWidth: 2,
    // borderColor: "#333",
  },
  text: { fontSize: 18, fontWeight: "500", marginBottom: 10 },
  row: { flexDirection: "row" },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  piece: {
    width: SQUARE_SIZE * 0.8,
    height: SQUARE_SIZE * 0.8,
    borderRadius: (SQUARE_SIZE * 0.9) / 2,
    borderBlockColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  king: { borderWidth: 2, borderColor: "gold" },
  kingText: { color: "white", fontWeight: "700" },
  selected: { borderWidth: 3, borderColor: "yellow" },
  valid: { borderWidth: 3, borderColor: "cyan" },
  controls: {},
  button: {
    // backgroundColor: "#3498db",
    // paddingHorizontal: 12,
    // paddingVertical: 6,
    // borderRadius: 6,
    // marginTop: 10,
    // alignContent: "center",
    // textAlign: "center",
  },
  buttonText: {
    backgroundColor: "#3498db",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 10,
    alignContent: "center",
    color: "white",
    textAlign: "center",
  },
});

export default function CheckersGame({ onGameComplete }: CheckersGameProps) {
  const [board, setBoard] = useState<Board>(() => initBoard());
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(
    null
  );
  const [validMoves, setValidMoves] = useState<
    Array<{ r: number; c: number; captures: Array<[number, number]> }>
  >([]);
  const [turn, setTurn] = useState<Player>("human");
  const [forcedCaptureSource, setForcedCaptureSource] = useState<{
    r: number;
    c: number;
  } | null>(null);

  useEffect(() => {
    if (turn === "ai") {
      // small timeout so UI updates before AI move
      const t = setTimeout(() => aiMove(), 400);
      return () => clearTimeout(t);
    }
  }, [turn]);

  useEffect(() => {
    const winner = checkGameOver(board);
    if (winner) {
      if (onGameComplete)
        onGameComplete(
          winner === "human" ? "human" : winner === "ai" ? "ai" : "draw"
        );
      Alert.alert("Game over", winner === "draw" ? "Draw" : `${winner} wins`);
    }
  }, [board]);

  function resetGame() {
    setBoard(initBoard());
    setSelected(null);
    setValidMoves([]);
    setTurn("human");
    setForcedCaptureSource(null);
  }

  function onSelectSquare(r: number, c: number) {
    const cell = board[r][c];
    if (turn !== "human") return;

    // if a forced capture source exists, only allow selecting that piece
    if (forcedCaptureSource) {
      if (!(forcedCaptureSource.r === r && forcedCaptureSource.c === c)) return;
    }

    if (selected && selected.r === r && selected.c === c) {
      // deselect
      setSelected(null);
      setValidMoves([]);
      return;
    }

    if (cell && cell.owner === "human") {
      const moves = computeValidMoves(board, r, c);
      // if forced capture exists, filter moves to captures only
      const captureOnly = getAllCaptures(board, "human");
      let filtered = moves;
      if (captureOnly.length > 0) {
        filtered = moves.filter((m) => m.captures.length > 0);
      }
      setSelected({ r, c });
      setValidMoves(filtered);
    } else if (selected) {
      // try to move to this square if valid
      const mv = validMoves.find((m) => m.r === r && m.c === c);
      if (mv) {
        performMove(selected.r, selected.c, mv.r, mv.c, mv.captures);
      }
    }
  }

  function performMove(
    sr: number,
    sc: number,
    tr: number,
    tc: number,
    captures: Array<[number, number]>
  ) {
    const next = cloneBoard(board);
    const piece = next[sr][sc];
    if (!piece) return;
    next[sr][sc] = null;
    next[tr][tc] = { ...piece };
    // remove captures
    captures.forEach(([cr, cc]) => {
      next[cr][cc] = null;
    });
    // kinging
    if (!next[tr][tc]!.king) {
      if (next[tr][tc]!.owner === "human" && tr === 0)
        next[tr][tc]!.king = true;
      if (next[tr][tc]!.owner === "ai" && tr === BOARD_SIZE - 1)
        next[tr][tc]!.king = true;
    }

    setBoard(next);

    // if human captured, check for additional captures from new pos
    if (turn === "human" && captures.length > 0) {
      const further = computeCapturesFrom(next, tr, tc);
      if (further.length > 0) {
        // force the same piece to continue capturing
        setForcedCaptureSource({ r: tr, c: tc });
        setSelected({ r: tr, c: tc });
        setValidMoves(
          further.map((to) => ({ r: to[0], c: to[1], captures: to[2] }))
        );
        return; // keep human turn
      }
    }

    // clear selection and forced capture
    setSelected(null);
    setValidMoves([]);
    setForcedCaptureSource(null);

    // switch turn
    setTurn((t) => (t === "human" ? "ai" : "human"));
  }

  // AI move: prefer captures; else random move
  function aiMove() {
    const moves = getAllMoves(board, "ai");
    if (moves.length === 0) {
      setTurn("human");
      return;
    }
    // separate captures
    const captures = moves.filter((m) => m.captures.length > 0);
    const choices = captures.length > 0 ? captures : moves;
    // choose random move
    const choice = choices[Math.floor(Math.random() * choices.length)];

    // perform move; if capture and more captures available, continue until no more
    const next = cloneBoard(board);
    const piece = next[choice.sr][choice.sc];
    if (!piece) return setTurn("human");
    next[choice.sr][choice.sc] = null;
    next[choice.tr][choice.tc] = { ...piece };
    choice.captures.forEach(([cr, cc]) => (next[cr][cc] = null));
    // kinging
    if (!next[choice.tr][choice.tc]!.king) {
      if (
        next[choice.tr][choice.tc]!.owner === "ai" &&
        choice.tr === BOARD_SIZE - 1
      )
        next[choice.tr][choice.tc]!.king = true;
      if (next[choice.tr][choice.tc]!.owner === "human" && choice.tr === 0)
        next[choice.tr][choice.tc]!.king = true;
    }

    setBoard(next);

    // if capture and further captures exist for this piece, continue (simple automatic continuation: AI plays full chain)
    if (choice.captures.length > 0) {
      let curR = choice.tr;
      let curC = choice.tc;
      let boardState = next;
      while (true) {
        const further = computeCapturesFrom(boardState, curR, curC);
        if (further.length === 0) break;
        const f = further[Math.floor(Math.random() * further.length)];
        const [nr, nc, caps] = f;
        const nb = cloneBoard(boardState);
        nb[curR][curC] = null;
        nb[nr][nc] = {
          ...(boardState[curR][curC] || { owner: "ai", king: false }),
        };
        caps.forEach(([cr, cc]) => (nb[cr][cc] = null));
        // kinging
        if (!nb[nr][nc]!.king && nr === BOARD_SIZE - 1) nb[nr][nc]!.king = true;
        boardState = nb;
        curR = nr;
        curC = nc;
        setBoard(boardState);
      }
    }

    // give control back to human
    setTimeout(() => setTurn("human"), 200);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {turn === "human" ? "It's Your Turn!" : "AI's Turn!"}
      </Text>
      <View style={styles.board}>
        {board.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((cell, c) => {
              const dark = (r + c) % 2 === 1;
              const isSelected =
                selected && selected.r === r && selected.c === c;
              const isValid = validMoves.some((m) => m.r === r && m.c === c);
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => onSelectSquare(r, c)}
                  activeOpacity={0.8}
                  style={[
                    styles.square,
                    { backgroundColor: dark ? "#8d6643" : "#efe4c6" },
                    isSelected && styles.selected,
                    isValid && styles.valid,
                  ]}
                >
                  {cell && (
                    <View
                      style={[
                        styles.piece,
                        {
                          backgroundColor:
                            cell.owner === "ai" ? "#789facff" : "#f4a72a",
                        },
                        cell.king && styles.king,
                      ]}
                    >
                      <View
                        style={{
                          backgroundColor:
                            cell.owner === "ai" ? "#607e87ff" : "#bd852a",
                          width: SQUARE_SIZE * 0.65,
                          height: SQUARE_SIZE * 0.65,
                          borderRadius: SQUARE_SIZE * 0.325,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              cell.owner === "ai" ? "#789facff" : "#f4a72a",
                            width: SQUARE_SIZE * 0.52,
                            height: SQUARE_SIZE * 0.52,
                            borderRadius: SQUARE_SIZE * 0.3,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {cell.king && <Text style={styles.kingText}>K</Text>}
                        </View>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        {/* <TouchableOpacity onPress={resetGame} style={styles.button}> */}
        <Text style={styles.buttonText}>Reset</Text>
        {/* </TouchableOpacity> */}
      </View>
    </View>
  );
}
