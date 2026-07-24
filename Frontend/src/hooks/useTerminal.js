import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

export function useTerminal(agentUrl, { onOutput } = {}) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [lines, setLines] = useState([]);

  const addLine = useCallback((line) => {
    if (onOutput) {
      const prefix = line.type === 'input' ? '$ ' : '';
      onOutput(prefix + line.text + '\r\n');
    }
    setLines((prev) => [...prev, line]);
  }, [onOutput]);

  useEffect(() => {
    if (!agentUrl) return;

    const match = agentUrl.match(/http:\/\/(.*?)\.agent/);
    let socket;

    if (match && match[1]) {
      const sandboxID = match[1];
      socket = io(window.location.origin, {
        path: `/agent-proxy/${sandboxID}/socket.io`,
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    } else {
      socket = io(agentUrl, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      addLine({ type: 'system', text: 'Connected to agent console' });
    });

    socket.on('disconnect', () => {
      setConnected(false);
      addLine({ type: 'system', text: 'Disconnected from terminal' });
    });

    socket.on('terminal-output', (data) => {
      const text = typeof data === 'string' ? data : JSON.stringify(data);
      addLine({ type: 'output', text });
    });

    socket.on('connect_error', (err) => {
      addLine({ type: 'error', text: `Connection error: ${err.message}` });
    });

    return () => {
      socket.disconnect();
    };
  }, [agentUrl, addLine]);

  const sendCommand = useCallback((cmd) => {
    if (!socketRef.current?.connected) return;
    addLine({ type: 'input', text: cmd });
    socketRef.current.emit('terminal-input', cmd + '\n');
  }, [addLine]);

  const clearTerminal = () => setLines([]);

  return { lines, connected, sendCommand, clearTerminal };
}
