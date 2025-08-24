'use client';

import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Shield, Info } from 'lucide-react';
import { usePreventRefresh } from '@/hooks/usePreventRefresh';

export default function BrowserRefreshDemo() {
  const [hasData, setHasData] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const { showWarning: hookWarning, dismissWarning } = usePreventRefresh({
    enabled: hasData,
    message: 'You have unsaved data. Are you sure you want to leave?',
    onRefreshAttempt: () => {
      if (hasData) {
        setShowWarning(true);
      }
    }
  });

  const handleSimulateData = () => {
    setHasData(true);
  };

  const handleClearData = () => {
    setHasData(false);
    setShowWarning(false);
  };

  const handleForceRefresh = () => {
    setShowWarning(false);
    // Simulate a refresh
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Browser Refresh Prevention Demo
        </h1>
        <p className="text-gray-600">
          This demo shows how the system prevents accidental browser refreshes
        </p>
      </div>

      {/* Status Card */}
      <div className={`p-4 rounded-lg border-2 ${
        hasData 
          ? 'bg-green-50 border-green-200' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${
            hasData ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <span className="font-medium">
            Status: {hasData ? 'Data Protected' : 'No Data to Protect'}
          </span>
        </div>
        {hasData && (
          <p className="text-sm text-green-700 mt-2">
            Try pressing F5 or Ctrl+R - the refresh will be blocked!
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSimulateData}
          disabled={hasData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Simulate Data Load
        </button>
        <button
          onClick={handleClearData}
          disabled={!hasData}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Data
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Info className="w-5 h-5" />
          How to Test
        </h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Click "Simulate Data Load" to enable protection</li>
          <li>Try pressing <kbd className="px-2 py-1 bg-blue-100 rounded text-xs">F5</kbd> or <kbd className="px-2 py-1 bg-blue-100 rounded text-xs">Ctrl+R</kbd></li>
          <li>Notice the refresh is blocked and warning appears</li>
          <li>Use "Clear Data" to disable protection</li>
        </ol>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white border rounded-lg">
          <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900">F5 Blocked</h4>
          <p className="text-sm text-gray-600">Prevents accidental refresh with F5 key</p>
        </div>
        <div className="text-center p-4 bg-white border rounded-lg">
          <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900">Ctrl+R Blocked</h4>
          <p className="text-sm text-gray-600">Prevents accidental refresh with Ctrl+R</p>
        </div>
        <div className="text-center p-4 bg-white border rounded-lg">
          <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900">Warning Modal</h4>
          <p className="text-sm text-gray-600">Shows confirmation before allowing refresh</p>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Refresh Blocked!</h3>
                <p className="text-sm text-gray-600">You have data that will be lost</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Refreshing the page will clear your current data. 
                Are you sure you want to continue?
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tip:</strong> Use the "Clear Data" button instead to safely reset.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleForceRefresh}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Continue & Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 