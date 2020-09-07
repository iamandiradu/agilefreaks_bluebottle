import React from 'react';
import logo from '../../images/logo.png';
import './app.css';

function App() {
    return (
        <div className="app">
            <header className="header">
                <div>
                    <span>Coffee Shop Finder Map </span>
                </div>
                <img src={logo} className="logo" alt="logo" />
            </header>
        </div>
    );
}

export default App;
