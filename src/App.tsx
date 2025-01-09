import React, { useState } from 'react';
import Table from './components/Table';
import TshirtDesigner from './components/TshirtDesigner';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'task1' | 'task2'>('task1');

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
            <h2>Task 1: Data Table</h2>
            <Table />
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
