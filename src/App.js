import './App.css';
import HomePage from './Components/HomePage';
import EmployeeList from './Components/EmployeeList';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import db from './firebaseConfig';


function App() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
  let employeeArray = [];
  let error;
            try {
                const data = await db.collection('employee').get();
                data.docs.map(el => {
                    let employee = { ...el.data(), 'id': el.id}
                    employeeArray.push(employee);
                    return  employeeArray;
                });
              setData(employeeArray)
            } catch (e) {
              error = 'error';
              return error;
            }
  }

  useEffect(() => {
   fetchData()
  }, [])
  
  return (
    <div className="App">
      <Router>
       <Switch>
          <Route exact path="/">
            <HomePage />
        </Route>
          <Route exact path="/employeeList">
            <EmployeeList employees={data}/>
        </Route>
	    </Switch>
    </Router>
    </div>
    
  );
}

export default App;
