import React, { useState, useEffect } from 'react';
import { debugLogger } from './debugLogger';
import { Bug, Download, X } from 'lucide-react';

export function DebugMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info' | 'debug'>('all');

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = filter === 'all' 
        ? debugLogger.getLogs()
        : debugLogger.getLogs(filter);
      setLogs(newLogs);
    }, 1000);

    return () => clearInterval(interval);
  }, [filter]);

  if (!process.env.NODE_ENV === 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-8 left-8 glass-button p-4 rounded-full"
      >
        <Bug className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="glass-card w-full max-w-4xl max-h-[80vh] m-4 flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Bug className="w-6 h-6 text-white" />
            <h2 className="text-lg font-semibold text-white">Debug Monitor</h2>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="glass-input px-3 py-1.5 rounded-lg text-sm"
            >
              <option value="all">All Logs</option>
              <option value="error">Errors</option>
              <option value="warn">Warnings</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
            <button
              onClick={() => debugLogger.downloadLogs()}
              className="glass-button p-2 rounded-lg"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="glass-button p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  log.level === 'error' ? 'bg-red-600/20' :
                  log.level === 'warn' ? 'bg-amber-600/20' :
                  log.level === 'info' ? 'bg-blue-600/20' :
                  'bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-mono text-white/60">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    log.level === 'error' ? 'bg-red-400/20 text-red-300' :
                    log.level === 'warn' ? 'bg-amber-400/20 text-amber-300' :
                    log.level === 'info' ? 'bg-blue-400/20 text-blue-300' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {log.level.toUpperCase()}
                  </span>
                </div>
                <p className="text-white mt-1">{log.message}</p>
                {log.data && (
                  <pre className="mt-2 p-2 rounded bg-black/20 text-white/80 text-sm font-mono overflow-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}