import Login from "./pages/login/Login";
import UserProfile from "./pages/profile/UserProfile";
import Home from "./pages/homepage/Homepage";
import SearchPage from "./pages/search/Search";
import {BrowserRouter, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/userProfile" exact component={UserProfile} />
      <Route path="/home" exact component={Home} />
      <Route path="/searchPage" exact component={SearchPage} />
    </BrowserRouter>
  );
}

export default App;
