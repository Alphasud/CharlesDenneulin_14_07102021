import './App.css';
import HomePage from './Components/HomePage';
import EmployeeList from './Components/EmployeeList';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


function App() {

  return (
    <div className="App">
      <Router>
       <Switch>
          <Route exact path="/">
            <HomePage />
        </Route>
          <Route exact path="/employeeList">
            <EmployeeList /* employees = {employees} */ />
        </Route>
	    </Switch>
    </Router>
    </div>
  );
}

export default App;
