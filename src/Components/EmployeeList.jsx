import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../firebaseConfig';

function EmployeeList() {
    
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await db.collection('employee').get();
                setEmployees(data.docs.map(el => el.data()));
            } catch (e) {
                setError(true);
            } 
        }
        fetchData();
    }, []);
    
    return (
        <div className = 'employee-page'>
        <h1 className='title'>Current Employees</h1>
        <Link className="employee__link" to='/'>Add Employee</Link>
        { !error ? 
        <div className='employee-container'>
            <div className='headings-container'>
                <div className='heading'>First Name</div>
                <div className='heading'>Last Name</div>
                <div className='heading'>Start Date</div>
                <div className='heading'>Department</div>
                <div className='heading'>Date of Birth</div>
                <div className='heading'>Street</div>
                <div className='heading'>City</div>
                <div className='heading'>State</div>
                <div className='heading'>Zip Code</div>
            </div>
            <div className='list__employees'>
                {employees.map(el => {
                    return <div key={Math.random()} className='list__employee'>
                        <p key={Math.random()}>{el.firstName}</p>
                        <p key={Math.random()}>{el.lastName}</p>
                        <p key={Math.random()}>{new Date(el.startDate.seconds*1000).toDateString()}</p>
                        <p key={Math.random()}>{el.department}</p>
                        <p key={Math.random()}>{new Date(el.birthDate.seconds*1000).toDateString()}</p>
                        <p key={Math.random()}>{el.street}</p>
                        <p key={Math.random()}>{el.city}</p>
                        <p key={Math.random()}>{el.state}</p>
                        <p key={Math.random()}>{el.zip}</p>
                    </div>
                })}
            </div>
        </div> : <div className='error'><h3>Oooops, something went wrong with the data fetching...</h3></div>}
        </div>
            
    );
}

export default EmployeeList;