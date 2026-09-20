import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
    return (
<main>
        <svg className="logo" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path transform="rotate(45 12 12)" d="M12 3 19 19 12 15 5 19Z"/>
        </svg>
        <h1>Rocketeers</h1>
        <p><b><u>Create React App</u></b> is ready for take off!</p>
    </main>
    );
}

createRoot(document.getElementById('root')).render(<App />);
