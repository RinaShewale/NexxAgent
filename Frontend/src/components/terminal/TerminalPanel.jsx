import { useEffect, useRef, useCallback } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { motion } from 'framer-motion';
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

    // Terminal Configuration aligned with the Studio Palette
    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'underline',
      fontSize: 12,
      lineHeight: 1.4,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      theme: {
        background: '#0D0E10', // Night
        foreground: '#C5C6C8', // Silver
        cursor: '#F8FAFA',     // Seasalt
        selectionBackground: 'rgba(248, 250, 250, 0.1)',
        black: '#282728',      // Raisin Black
        red: '#f43f5e',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#8b5cf6',
        cyan: '#06b6d4',
        white: '#F8FAFA',      // Seasalt
        brightBlack: '#4F5052', // Davy's Gray
        brightRed: '#fb7185',
        brightGreen: '#34d399',
        brightYellow: '#fbbf24',
        brightBlue: '#60a5fa',
        brightMagenta: '#a78bfa',
        brightCyan: '#22d3ee',
        brightWhite: '#F8FAFA',
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
        const el = termRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (!rect || rect.width === 0 || rect.height === 0) return;
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
    setTimeout(fitTerminal, 200);

    return () => {
      resizeObserver.disconnect();
      try {
        term.dispose();
      } catch {}
      terminalRef.current = null;
    };
  }, [agentUrl, sendCommand, connected]);

  return (
    <div className="flex flex-col h-full bg-[#0D0E10] overflow-hidden selection:bg-[#F8FAFA]/10">
      {/* Utility Header Bar */}
      <div className="h-9 px-4 border-b border-[#282728] flex items-center justify-between bg-[#161618]/30 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-bold text-[#818263] uppercase tracking-[0.25em]">
            Terminal
          </span>
          
          <div className="flex items-center gap-2 border-l border-[#282728] pl-4">
            <motion.div 
              animate={!connected ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                connected ? 'bg-[#F8FAFA] shadow-[0_0_8px_#F8FAFA]' : 'bg-[#4F5052]'
              }`} 
            />
            <span className="text-[9px] font-mono font-bold text-[#4F5052] uppercase tracking-tighter">
              {connected ? 'Status: Active' : 'Status: Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearTerminal}
            className="text-[9px] font-bold uppercase text-[#4F5052] hover:text-[#C5C6C8] transition-all px-2 py-1 rounded hover:bg-[#282728]"
          >
            Clear Shell
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 min-h-0 relative p-3"
      >
        <div ref={termRef} className="absolute inset-3" />
      </motion.div>

      {/* Modern Inner Glow Overlay (Decorative) */}
      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#0D0E10] to-transparent pointer-events-none opacity-50" />

      <style dangerouslySetInnerHTML={{ __html: `
        /* Override xterm standard scrollbar to match our palette */
        .xterm-viewport::-webkit-scrollbar {
          width: 6px;
        }
        .xterm-viewport::-webkit-scrollbar-track {
          background: #0D0E10;
        }
        .xterm-viewport::-webkit-scrollbar-thumb {
          background: #282728;
          border-radius: 10px;
        }
        .xterm-viewport::-webkit-scrollbar-thumb:hover {
          background: #4F5052;
        }
      `}} />
    </div>
  );
}