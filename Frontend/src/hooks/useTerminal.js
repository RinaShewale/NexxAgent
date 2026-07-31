import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

export function useTerminal(agentUrl, { onOutput } = {}) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const onOutputRef = useRef(onOutput);
  useEffect(() => {
    onOutputRef.current = onOutput;
  }, [onOutput]);

  useEffect(() => {
    if (!agentUrl) return;

    let socket;
    const match = agentUrl.match(/http:\/\/(.*?)\.agent/);

    if (match && match[1]) {
      const sandboxID = match[1];
      socket = io(window.location.origin, {
        path: `/agent-proxy/${sandboxID}/socket.io`,
        transports: ['polling', 'websocket'],
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        autoConnect: true,
      });
    } else {
      socket = io(agentUrl, {
        transports: ['polling', 'websocket'],
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        autoConnect: true,
      });
    }

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      onOutputRef.current?.('\r\n\x1b[32m[Connected to terminal console]\x1b[0m\r\n');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      onOutputRef.current?.('\r\n\x1b[31m[Disconnected from terminal]\x1b[0m\r\n');
    });

    socket.on('terminal-output', (data) => {
      const text = typeof data === 'string' ? data : String(data);
      onOutputRef.current?.(text);
    });

    socket.on('connect_error', (err) => {
      setConnected(false);
      onOutputRef.current?.(`\r\n\x1b[31m[Connection error: ${err.message}]\x1b[0m\r\n`);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [agentUrl]);

  const sendCommand = useCallback((data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('terminal-input', data);
    }
  }, []);

  return { connected, sendCommand };
}

