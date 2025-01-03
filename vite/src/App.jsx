import { useState } from 'react';
import HumanStart from './Components/HumanStart';
import AIStarts from './Components/AIStarts';

function App() {
  const [humanStarts, setHumanStarts] = useState(false); 

  const toggleStart = () => {
    setHumanStarts(!humanStarts); 
  };

  return (
    <div>
      <div className="pt-4 text-center font-bold bg-gray-100">
        <button onClick={toggleStart}>
          {humanStarts ? "Human Starts" : "AI Starts"} 
        </button>
      </div>
      {humanStarts ? <HumanStart /> : <AIStarts />} 
    </div>
  );
}

export default App;