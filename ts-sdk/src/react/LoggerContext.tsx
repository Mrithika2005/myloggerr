import React, { createContext, useContext, useMemo } from 'react';
import { Logger } from '../core/logger';
import { LogHandler } from '../core/interfaces';
import { Level, Layer } from '../core/enums';

interface LoggerContextType {
  logger: Logger<any>;
}

const LoggerContext = createContext<LoggerContextType | null>(null);

export const LoggerProvider: React.FC<{ 
  service: string; 
  env: string; 
  handlers: LogHandler[];
  children: React.ReactNode;
}> = ({ service, env, handlers, children }) => {
  // We use a general logger as the base
  const logger = useMemo(() => {
    class GenericLogger extends Logger<any> {
      createRecord(message: string, level: Level, ctx: Record<string, any>) {
        return {
          ...this.getBaseProps(message, level, Layer.PRESENTATION, ctx),
          ...ctx
        };
      }
    }
    return new GenericLogger({ service, env, handlers });
  }, [service, env, handlers]);

  return (
    <LoggerContext.Provider value={{ logger }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error('useLogger must be used within a LoggerProvider');
  }
  return context.logger;
};
