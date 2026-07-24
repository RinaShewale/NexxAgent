import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useTerminal } from '../../hooks/useTerminal';
import 'xterm/css/xterm.css';

export default function TerminalPanel({ agentUrl }) {
  const termRef = useRef(null);
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(null);

  const { connected, sendCommand, clearTerminal } = useTerminal(agentUrl, {
    onOutput: (text) => terminalRef.current?.write(text),
  });

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

    const resizeObserver = new ResizeObserver(() => {
      try { fitAddon.fit(); } catch {}
    });
    resizeObserver.observe(termRef.current);

    setTimeout(() => {
      try { fitAddon.fit(); } catch {}
    }, 50);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
      terminalRef.current = null;
    };
  }, [agentUrl]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-black/40 shrink-0">
        <span className="text-[10px] font-bold text-slate-500">TERMINAL</span>
        <div className="flex items-center gap-2">
          <button
            onClick={clearTerminal}
            className="text-[9px] uppercase text-slate-600 hover:text-slate-300 mr-2 transition-colors"
          >
            Clear
          </button>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-teal-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-[9px] uppercase">{connected ? 'Connected' : 'Offline'}</span>
        </div>
      </div>
      <div ref={termRef} className="flex-1 min-h-0" />
    </div>
  );
}
