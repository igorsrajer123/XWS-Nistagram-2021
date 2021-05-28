import Registration from "./pages/registration/Registration"
import Login from "./pages/login/Login"
import {BrowserRouter, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Route path="/login" exact component={Login} />
      <Route path="/registration" exact component={Registration} />
    </BrowserRouter>
  );
}

export default App;
