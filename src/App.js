import './App.css';
import MakerProvider from './MakerContext';
import Maker from './components/Maker/Maker';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MakerProvider>
          <Maker />
        </MakerProvider>
      </header>
    </div>
  );
}

export default App;
