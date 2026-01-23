import React, { useState, useEffect, useCallback } from "react";
import {
  getCurrentUserId,
  gameServiceClient,
  GameServiceClientEvent,
  matchmakingServiceClient,
  MatchmakingServiceClientEvent,
  spectatorServiceClient,
  SpectatorServiceClientEvent,
} from "./lib/client";
import { audioManager } from "./audio/AudioManager";
import { Icon, Icons } from "./components/Icon";
import { LobbyView } from "./features/lobby/LobbyView";
import { QueueView } from "./features/game/QueueView";
import { GameView } from "./features/game/GameView";
import { SpectatorListView } from "./features/spectator/SpectatorListView";
import { SpectatorGameView } from "./features/spectator/SpectatorGameView";
import { LeaderboardView } from "./features/leaderboard/LeaderboardView";
import {
  Game,
  GameStatus,
  MatchFoundEvent,
  QueueUpdatedEvent,
  GameUpdatedEvent,
  GameEndedEvent,
  SpectatorGameUpdateEvent,
} from "@tictactoe/gen-shared";
import { CellState, isGameOver } from "./core/GameLogic";
import "./App.css";

/** Delay before showing AI move for better UX */
const AI_MOVE_DELAY_MS: number = 500;

/** Application view states */
type View = "lobby" | "queue" | "game" | "spectator-list" | "spectator-game" | "leaderboard";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("lobby");
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [spectatingGame, setSpectatingGame] = useState<Game | null>(null);
  const [queuePosition, setQueuePosition] = useState(0);
  const [totalInQueue, setTotalInQueue] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSubmittingMove, setIsSubmittingMove] = useState(false);

  const handleMatchFound = useCallback((event: MatchFoundEvent): void => {
    if (event.game) {
      audioManager.playMatchFound();
      setCurrentGame(event.game);
      setCurrentView("game");
    }
  }, []);

  const handleQueueUpdated = useCallback((event: QueueUpdatedEvent): void => {
    setQueuePosition(event.position);
    setTotalInQueue(event.totalInQueue);
  }, []);

  const handleGameUpdated = useCallback((event: GameUpdatedEvent): void => {
    if (!event.game) return;

    setCurrentGame((prevGame: Game | null): Game => {
      if (prevGame && event.game) {
        const currentUserId: string = getCurrentUserId();
        const isPlayerX: boolean = prevGame.playerX?.userId === currentUserId;
        const isPlayerO: boolean = prevGame.playerO?.userId === currentUserId;
        const isMyGame: boolean = isPlayerX || isPlayerO;

        if (isMyGame) {
          const myMarker: CellState = isPlayerX ? CellState.X : CellState.O;
          const wasMyTurn: boolean = prevGame.currentTurn === myMarker;
          const turnChanged: boolean = event.game.currentTurn !== prevGame.currentTurn;

          if (wasMyTurn && turnChanged) {
            audioManager.playOpponentMove();
          }
        }
      }
      return event.game!;
    });
  }, []);

  const handleGameEnded = useCallback((event: GameEndedEvent): void => {
    if (!event.game) return;

    setCurrentGame(event.game);

    const currentUserId: string = getCurrentUserId();
    const didWin: boolean = event.game.winnerId === currentUserId;
    const isDraw: boolean = event.game.status === GameStatus.DRAW;

    if (didWin) {
      audioManager.playWin();
    } else if (isDraw) {
      audioManager.playDraw();
    } else {
      audioManager.playLose();
    }
  }, []);

  const handleSpectatorUpdate = useCallback((event: SpectatorGameUpdateEvent): void => {
    if (event.game) {
      setSpectatingGame(event.game);
    }
  }, []);

  useEffect(() => {
    matchmakingServiceClient.on(MatchmakingServiceClientEvent.MatchFound, handleMatchFound);
    matchmakingServiceClient.on(MatchmakingServiceClientEvent.QueueUpdated, handleQueueUpdated);
    gameServiceClient.on(GameServiceClientEvent.GameUpdated, handleGameUpdated);
    gameServiceClient.on(GameServiceClientEvent.GameEnded, handleGameEnded);
    spectatorServiceClient.on(SpectatorServiceClientEvent.SpectatorGameUpdate, handleSpectatorUpdate);

    return () => {
      matchmakingServiceClient.off(MatchmakingServiceClientEvent.MatchFound, handleMatchFound);
      matchmakingServiceClient.off(MatchmakingServiceClientEvent.QueueUpdated, handleQueueUpdated);
      gameServiceClient.off(GameServiceClientEvent.GameUpdated, handleGameUpdated);
      gameServiceClient.off(GameServiceClientEvent.GameEnded, handleGameEnded);
      spectatorServiceClient.off(SpectatorServiceClientEvent.SpectatorGameUpdate, handleSpectatorUpdate);
    };
  }, [handleMatchFound, handleQueueUpdated, handleGameUpdated, handleGameEnded, handleSpectatorUpdate]);

  const handlePlayAI = useCallback(async (): Promise<void> => {
    try {
      audioManager.playClick();
      const response = await gameServiceClient.createAIGame({});
      if (response.game) {
        setCurrentGame(response.game);
        setCurrentView("game");
      }
    } catch (error: unknown) {
      console.error("Failed to create AI game:", error);
    }
  }, []);

  const handlePlayOnline = useCallback(async (): Promise<void> => {
    try {
      audioManager.playClick();
      const response = await matchmakingServiceClient.joinQueue({});
      if (response.success) {
        // Check if a match was found immediately
        if (response.game) {
          audioManager.playMatchFound();
          setCurrentGame(response.game);
          setCurrentView("game");
        } else {
          setQueuePosition(response.position);
          setTotalInQueue(response.position);
          setCurrentView("queue");
        }
      }
    } catch (error: unknown) {
      console.error("Failed to join queue:", error);
    }
  }, []);

  const handleCancelQueue = useCallback(async (): Promise<void> => {
    try {
      audioManager.playClick();
      await matchmakingServiceClient.leaveQueue({});
      setCurrentView("lobby");
    } catch (error: unknown) {
      console.error("Failed to leave queue:", error);
    }
  }, []);

  const handleMove = useCallback(async (position: number): Promise<void> => {
    if (!currentGame || isSubmittingMove) return;

    setIsSubmittingMove(true);
    try {
      audioManager.playMove();

      const currentUserId: string = getCurrentUserId();
      const isPlayerX: boolean = currentGame.playerX?.userId === currentUserId;
      const userMarker: CellState = isPlayerX ? CellState.X : CellState.O;
      const opponentMarker: CellState = isPlayerX ? CellState.O : CellState.X;

      // Optimistically update UI before server response
      const updatedBoard: number[] = [...currentGame.board];
      updatedBoard[position] = userMarker;

      setCurrentGame({
        ...currentGame,
        board: updatedBoard,
        currentTurn: opponentMarker,
      });

      const response = await gameServiceClient.makeMove({
        gameId: currentGame.gameId,
        position,
      });

      if (response.game) {
        const isAIGame: boolean = currentGame.playerO?.displayName === "Computer";
        const gameStillInProgress: boolean = !isGameOver(response.game.status);
        const boardChanged: boolean = response.game.board.some(
          (cell: number, i: number): boolean => cell !== updatedBoard[i]
        );
        const aiMoved: boolean = isAIGame && gameStillInProgress && boardChanged;

        if (aiMoved) {
          await new Promise<void>((resolve) => setTimeout(resolve, AI_MOVE_DELAY_MS));
          audioManager.playOpponentMove();
        }

        setCurrentGame(response.game);

        if (isGameOver(response.game.status)) {
          const didWin: boolean = response.game.winnerId === currentUserId;
          const isDraw: boolean = response.game.status === GameStatus.DRAW;

          if (didWin) {
            audioManager.playWin();
          } else if (isDraw) {
            audioManager.playDraw();
          } else {
            audioManager.playLose();
          }
        }
      }
    } catch (error: unknown) {
      console.error("Failed to make move:", error);
    } finally {
      setIsSubmittingMove(false);
    }
  }, [currentGame, isSubmittingMove]);

  const handleRematch = useCallback(async (): Promise<void> => {
    if (!currentGame) return;

    try {
      audioManager.playClick();
      const response = await gameServiceClient.requestRematch({
        gameId: currentGame.gameId,
      });
      if (response.success && response.newGame) {
        setCurrentGame(response.newGame);
      } else {
        setCurrentGame(null);
        setCurrentView("lobby");
      }
    } catch (error: unknown) {
      console.error("Failed to request rematch:", error);
      setCurrentGame(null);
      setCurrentView("lobby");
    }
  }, [currentGame]);

  const handleLeaveGame = useCallback(async (): Promise<void> => {
    if (!currentGame) {
      setCurrentView("lobby");
      return;
    }

    try {
      audioManager.playClick();
      if (currentGame.status === GameStatus.IN_PROGRESS) {
        await gameServiceClient.forfeit({ gameId: currentGame.gameId });
      }
      setCurrentGame(null);
      setCurrentView("lobby");
    } catch (error: unknown) {
      console.error("Failed to leave game:", error);
      setCurrentGame(null);
      setCurrentView("lobby");
    }
  }, [currentGame]);

  const handleWatchGame = useCallback(async (gameId: string): Promise<void> => {
    try {
      audioManager.playClick();
      const response = await spectatorServiceClient.watchGame({ gameId });
      if (response.success && response.game) {
        setSpectatingGame(response.game);
        setCurrentView("spectator-game");
      }
    } catch (error: unknown) {
      console.error("Failed to watch game:", error);
    }
  }, []);

  const handleStopWatching = useCallback(async (): Promise<void> => {
    if (spectatingGame) {
      try {
        await spectatorServiceClient.stopWatching({ gameId: spectatingGame.gameId });
      } catch (error: unknown) {
        console.error("Failed to stop watching:", error);
      }
    }
    setSpectatingGame(null);
    setCurrentView("spectator-list");
  }, [spectatingGame]);

  const toggleSound = useCallback((): void => {
    const enabled: boolean = audioManager.toggle();
    setSoundEnabled(enabled);
    if (enabled) {
      audioManager.playClick();
    }
  }, []);

  const handleSpectate = useCallback((): void => {
    audioManager.playClick();
    setCurrentView("spectator-list");
  }, []);

  const handleLeaderboard = useCallback((): void => {
    audioManager.playClick();
    setCurrentView("leaderboard");
  }, []);

  const handleBackToLobby = useCallback((): void => {
    audioManager.playClick();
    setCurrentView("lobby");
  }, []);

  const renderView = (): React.ReactNode => {
    switch (currentView) {
      case "lobby":
        return (
          <LobbyView
            onPlayAI={handlePlayAI}
            onPlayOnline={handlePlayOnline}
            onSpectate={handleSpectate}
            onLeaderboard={handleLeaderboard}
          />
        );

      case "queue":
        return (
          <QueueView
            position={queuePosition}
            totalInQueue={totalInQueue}
            onCancel={handleCancelQueue}
          />
        );

      case "game":
        return currentGame ? (
          <GameView
            game={currentGame}
            currentUserId={getCurrentUserId()}
            onMove={handleMove}
            onRematch={handleRematch}
            onLeave={handleLeaveGame}
          />
        ) : null;

      case "spectator-list":
        return (
          <SpectatorListView
            onWatchGame={handleWatchGame}
            onBack={handleBackToLobby}
          />
        );

      case "spectator-game":
        return spectatingGame ? (
          <SpectatorGameView
            game={spectatingGame}
            onBack={handleStopWatching}
          />
        ) : null;

      case "leaderboard":
        return (
          <LeaderboardView
            onBack={handleBackToLobby}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-text">
          <h1 className="app-title">Tic Tac Toe</h1>
          <p className="app-subtitle">Classic game for Root</p>
        </div>
        <button className="sound-toggle" onClick={toggleSound} title={soundEnabled ? "Mute" : "Unmute"}>
          <Icon svg={soundEnabled ? Icons.volumeHigh : Icons.volumeOff} size={20} />
        </button>
      </header>

      <main>{renderView()}</main>
    </div>
  );
};

export default App;
