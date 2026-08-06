import { useEffect, useRef, useCallback } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { motion } from 'framer-motion';
import { useTerminal } from '../../hooks/useTerminal';
import { Terminal, Trash2, Zap, Wifi, WifiOff } from 'lucide-react';
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
    if (!connected) {
      try {
        if (terminalRef.current) {
          terminalRef.current.dispose();
          terminalRef.current = null;
        }
      } catch {}
      return;
    }

    if (terminalRef.current) return;

    // Terminal Configuration: High-Contrast Nexx Theme
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 13,
      lineHeight: 1.5,
      letterSpacing: 0.5,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#3b82f6',
        cursorAccent: '#000000',
        selectionBackground: 'rgba(59, 130, 246, 0.3)',
        black: '#000000',
        red: '#f43f5e',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#8b5cf6',
        cyan: '#06b6d4',
        white: '#ffffff',
        brightBlack: '#404040',
        brightRed: '#fb7185',
        brightGreen: '#34d399',
        brightYellow: '#fbbf24',
        brightBlue: '#60a5fa',
        brightMagenta: '#a78bfa',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff',
      },
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddonRef.current = fitAddon;

    term.open(termRef.current);
    terminalRef.current = term;

    term.onData((data) => {
      if (connected) sendCommand(data);
    });

    const fitTerminal = () => {
      try {
        if (!terminalRef.current || !fitAddonRef.current) return;
        fitAddonRef.current.fit();
      } catch (err) {
        console.warn('Terminal fit failed', err);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!termRef.current) return;
      fitTerminal();
    });
    resizeObserver.observe(termRef.current);

    setTimeout(fitTerminal, 50);

    return () => {
      resizeObserver.disconnect();
      try {
        term.dispose();
      } catch {}
      terminalRef.current = null;
    };
  }, [agentUrl, sendCommand, connected]);

  return (
    <div className="flex flex-col h-full bg-[#000] overflow-hidden">
      {/* Premium Header Bar */}
      <div className="h-11 px-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01] shrink-0 select-none">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-zinc-500">
            <Terminal size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Console</span>
          </div>
          
          <div className="flex items-center gap-3 border-l border-white/10 pl-5">
            <div className="relative flex items-center justify-center">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${
                connected ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-zinc-800'
              }`} />
              {connected && (
                <motion.div 
                  animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-full h-full bg-blue-500 rounded-full"
                />
              )}
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              {connected ? 'Active_Session' : 'Offline'}
              {connected ? <Zap size={10} className="text-yellow-500 fill-yellow-500" /> : null}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearTerminal}
            title="Clear Console"
            className="p-2 text-zinc-600 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 min-h-0 relative p-4 group"
      >
        <div ref={termRef} className="absolute inset-4 overflow-hidden" />
      </motion.div>

      {/* Technical Footer Detail */}
      <div className="h-6 px-5 border-t border-white/5 bg-black flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-[0.1em]">sh --login</span>
        </div>
        <span className="text-[8px] font-mono text-zinc-800">UTF-8 // ZSH</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Xterm Scrollbar Customization */
        .xterm-viewport::-webkit-scrollbar {
          width: 4px;
        }
        .xterm-viewport::-webkit-scrollbar-track {
          background: #000;
        }
        .xterm-viewport::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        .xterm-viewport::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
        .xterm-cursor {
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
        }
      `}} />
    </div>
  );
}