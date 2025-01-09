import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import TshirtDesigner from './components/TshirtDesigner';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'task1' | 'task2'>('task1');
  const [dataStatus, setDataStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [corsError, setCorsError] = useState(false);

  useEffect(() => {
    const checkData = async () => {
      try {
        setDataStatus('loading');
        setCorsError(false);
        const response = await fetch('https://api.razzakfashion.com');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDataStatus(data && data.length > 0 ? 'success' : 'error');
      } catch (error) {
        if (error.message.includes('Failed to fetch')) {
          setCorsError(true);
        }
        console.error('Error fetching data:', error);
        setDataStatus('error');
      }
    };
    
    if (activeTab === 'task1') {
      checkData();
    }
  }, [activeTab]);

  return (
    <div className="App">
      <div className="tab-container">
        <button 
          className={`tab-button ${activeTab === 'task1' ? 'active' : ''}`}
          onClick={() => setActiveTab('task1')}
        >
          Task 1
        </button>
        <button 
          className={`tab-button ${activeTab === 'task2' ? 'active' : ''}`}
          onClick={() => setActiveTab('task2')}
        >
          Task 2
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'task1' ? (
          <div className="task-container">
            {dataStatus === 'error' && corsError && (
              <h3>If data is not loading, please disable cors in browser using chrome://extensions/ and reload the page</h3>
            )}
            <h2>Task 1: Data Table</h2>
            {dataStatus === 'loading' ? (
              <div className="loading">Loading...</div>
            ) : (
              <Table />
            )}
          </div>
        ) : (
          <div className="task-container">
            <h2>Task 2: T-Shirt Designer</h2>
            <TshirtDesigner />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
