import { useEffect, useRef, useCallback } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useTerminal } from '../../hooks/useTerminal';
import 'xterm/css/xterm.css';

export default function TerminalPanel({ agentUrl }) {
  const termRef = useRef(null);
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(null);

  const handleOutput = useCallback((text) => {
    terminalRef.current?.write(text);
  }, []);

  const { connected, sendCommand } = useTerminal(agentUrl, {
    onOutput: handleOutput,
  });

  const clearTerminal = () => {
    terminalRef.current?.clear();
  };

  useEffect(() => {
    if (!termRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'underline',
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      theme: {
        background: '#010409',
        foreground: '#e2e8f0',
        cursor: '#2dd4bf',
        selectionBackground: '#2dd4bf33',
        black: '#484f58',
        red: '#ff7b72',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#b1bac4',
        brightBlack: '#6e7681',
        brightRed: '#ffa198',
        brightGreen: '#56d364',
        brightYellow: '#e3b341',
        brightBlue: '#79c0ff',
        brightMagenta: '#d2a8ff',
        brightCyan: '#56d4dd',
        brightWhite: '#f0f6fc',
      },
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddonRef.current = fitAddon;

    term.open(termRef.current);
    terminalRef.current = term;

    term.onData((data) => {
      sendCommand(data);
    });

    const fitTerminal = () => {
      try {
        fitAddon.fit();
      } catch {}
    };

    const resizeObserver = new ResizeObserver(() => {
      fitTerminal();
    });
    resizeObserver.observe(termRef.current);

    setTimeout(fitTerminal, 50);
    setTimeout(fitTerminal, 200);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
      terminalRef.current = null;
    };
  }, [agentUrl, sendCommand]);

  return (
    <div className="flex flex-col h-full bg-[#010409]">
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-black/40 shrink-0 select-none">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider">TERMINAL</span>
        <div className="flex items-center gap-2">
          <button
            onClick={clearTerminal}
            className="text-[9px] uppercase text-slate-500 hover:text-slate-300 mr-2 transition-colors px-2 py-0.5 rounded hover:bg-white/5"
          >
            Clear
          </button>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-teal-500 shadow-sm shadow-teal-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-[9px] uppercase font-mono text-slate-400">{connected ? 'Connected' : 'Offline'}</span>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative p-2">
        <div ref={termRef} className="absolute inset-2" />
      </div>
    </div>
  );
}

