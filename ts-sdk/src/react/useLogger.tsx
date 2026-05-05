import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { BrowserLogger } from '../layers/browser';
import { LoggerConfig } from '../core/interfaces';
import { ConsoleHandler } from '../core/handlers';

interface LoggerContextType {
  logger: BrowserLogger;
}

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

export const LoggerProvider: React.FC<{ config: Partial<LoggerConfig>, children: ReactNode }> = ({ config, children }) => {
  const logger = useMemo(() => {
    const fullConfig: LoggerConfig = {
      service: 'my-app',
      env: 'dev',
      handlers: [new ConsoleHandler()],
      enrichers: [],
      ...config
    };
    return new BrowserLogger(fullConfig);
  }, [config]);

  return (
    <LoggerContext.Provider value={{ logger }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = (componentCtx: Record<string, any> = {}) => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error('useLogger must be used within a LoggerProvider');
  }

  // Return a "child" behavior by merging component context
  return context.logger;
};
