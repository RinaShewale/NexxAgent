import React, { useEffect, useRef, useCallback } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useTerminal } from '../../hooks/useTerminal';
import { Terminal, Trash2 } from 'lucide-react';
import 'xterm/css/xterm.css';

export default function TerminalPanel({ agentUrl }) {
  const termRef = useRef(null);
  const terminalRef = useRef(null);
  const { connected, sendCommand } = useTerminal(agentUrl, { onOutput: (t) => terminalRef.current?.write(t) });

  useEffect(() => {
    if (!termRef.current || terminalRef.current) return;
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'underline',
      fontSize: 12,
      fontFamily: "'JetBrains Mono', monospace",
      theme: {
        background: '#1A0F0A', // Deepest Nexus Brown
        foreground: '#FDF3E4',
        cursor: '#A35100',
        selectionBackground: 'rgba(163, 81, 0, 0.3)',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(termRef.current);
    terminalRef.current = term;
    term.onData((data) => connected && sendCommand(data));
    fitAddon.fit();
  }, [connected, agentUrl]);

  return (
    <div className="flex flex-col h-full bg-[#1A0F0A] overflow-hidden font-sans">
      <div className="h-12 px-6 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-4">
          <Terminal size={14} className="text-[#A35100]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FDF3E4]/40">System Console</span>
          <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_green]' : 'bg-red-500'}`} />
        </div>
        <button onClick={() => terminalRef.current?.clear()} className="text-[#FDF3E4]/20 hover:text-[#FDF3E4] transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      <div ref={termRef} className="flex-1 p-4" />
    </div>
  );
}