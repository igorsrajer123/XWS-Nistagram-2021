import Login from "./pages/login/Login"
import {BrowserRouter, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
    </BrowserRouter>
  );
}

export default App;
