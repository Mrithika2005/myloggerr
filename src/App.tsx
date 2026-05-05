/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LoggerProvider } from '../ts-sdk/src/react/LoggerContext';
import { ConsoleHandler, ApiHandler } from '../ts-sdk/src/core/handlers';
import { useLogger } from '../ts-sdk/src/react/LoggerContext';
import { DomainLogger } from '../ts-sdk/src/layers/domain-logger';

const SDKTester = () => {
  const logger = useLogger();
  const domainLogger = new DomainLogger({
    service: 'test-service',
    env: 'dev',
    handlers: (logger as any).handlers
  });

  const runTest = () => {
    // 1. Base Log
    logger.info("SDK verification check");
    
    // 2. DDD Structured Log
    domainLogger.logEvent(
      'UserRegistered', 
      'User', 
      'user_99', 
      { method: 'google', email_verified: true }
    );
    
    alert("Logs emitted. Check 'logs.txt' on the server!");
  };

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Mylogger SDK Active</h1>
      <p className="text-slate-600 mb-6">This is the core SDK project. Use the button below to verify the handlers.</p>
      <button 
        onClick={runTest}
        className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
      >
        Emit Test DDD Logs
      </button>
    </div>
  );
};

export default function App() {
  const handlers = [
    new ConsoleHandler(),
    new ApiHandler('/api/logs')
  ];

  return (
    <LoggerProvider service="core-sdk-dev" env="local" handlers={handlers}>
      <SDKTester />
    </LoggerProvider>
  );
}

