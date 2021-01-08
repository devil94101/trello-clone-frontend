import './App.css';
import {BrowserRouter as Router ,Switch,Route} from 'react-router-dom'
import Login from './Components/UserAuth/Login'
import SignUp from './Components/UserAuth/SignUp'
import Dashboard from './Components/List/DashBoard'
import {Provider} from 'react-redux'
import {store} from './Redux/store'
import CreateBoard from './Components/Form/CreateBoard'
import Lists from './Components/List/lists'

function App() {

  return (
    <div className="App">
      <Provider store={store}>
      <Router>
        <Switch>
        <Route path="/" exact component={Dashboard}/>
        <Route path="/dashboard/:id" exact component={Lists}></Route>
        <Route path="/createBoard" >
          <CreateBoard/>
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
        <Route path="/login" >
            <Login />
        </Route>
        </Switch>
      </Router>
      </Provider>
    </div>
  );
}

export default App;
