import './App.css';
import MakerProvider from './MakerContext';
import Maker from './components/Maker/Maker';

function App() {
  return (
    <div className="App">
        <MakerProvider>
          <Maker />
        </MakerProvider>
    </div>
  );
}

export default App;
