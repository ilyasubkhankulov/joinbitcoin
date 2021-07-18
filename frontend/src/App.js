// import logo from './jira_notion_sync.svg';
import './App.css';
import LinkAccount from './components/linkAccount';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LinkAccount></LinkAccount>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
    </div>
  );
}

export default App;
