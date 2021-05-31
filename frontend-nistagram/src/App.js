import Login from "./pages/login/Login";
import UserProfile from "./pages/profile/UserProfile";
import Home from "./pages/homepage/Homepage";
import {BrowserRouter, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/userProfile" exact component={UserProfile} />
      <Route path="/home" exact component={Home} />
    </BrowserRouter>
  );
}

export default App;
