import './App.css';
import { useEffect, useState } from 'react';
import HomePage from './Components/HomePage';
import EmployeeList from './Components/EmployeeList';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import db from './firebaseConfig';

function App() {

  const [employees, setEmployees] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const data = await db.collection('employee').get()
      setEmployees(data.docs.map(el => el.data()))
    }
    fetchData();
  }, []);

  console.log(employees);

  return (
    <div className="App">
      <Router>
       <Switch>
          <Route exact path="/">
            <HomePage />
        </Route>
          <Route exact path="/employeeList">
            <EmployeeList employees = {employees} />
        </Route>
	    </Switch>
    </Router>
    </div>
  );
}

export default App;
