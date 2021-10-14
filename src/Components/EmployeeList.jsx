import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../firebaseConfig';
import Modal from './Modal/Modal';

function EmployeeList() {
    
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(false);
    const [employeeDeleted, setEmployeeDeleted] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');

    const fetchData = async () => {
            let employeeArray = [];
            try {
                const data = await db.collection('employee').get();
                data.docs.map(el => {
                    let employee = { ...el.data(), 'id': el.id}
                    employeeArray.push(employee)
                    return employeeArray
                })
                setEmployees(employeeArray);
            } catch (e) {
                setError(true);
            } 
        }

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (id, firstName) => {
        console.log(`Delete user with id: ${id}`);
        try {
            db.collection('employee').doc(id).delete();
            //fetchData();
            setEmployeeDeleted(true);
            setDeleteMessage(`Gotcha! ${firstName} is no longer in the team ;)`);
        } catch (error) {
            console.log('Error deleting employee');
            console.log(error);
        }
    }
    const handleModalResponse = (data) => {
        if (data === 'click') {
            setEmployeeDeleted(false);
            setDeleteMessage('');
            fetchData();
        }
    }

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
                <div className='heading'>Action</div>
            </div>
            <div className='list__employees'>
                {employees.map(el => {
                    return <div key={el.id} className='list__employee'>
                        <p key={Math.random()}>{el.firstName}</p>
                        <p key={Math.random()}>{el.lastName}</p>
                        <p key={Math.random()}>{new Date(el.startDate.seconds*1000).toDateString()}</p>
                        <p key={Math.random()}>{el.department}</p>
                        <p key={Math.random()}>{new Date(el.birthDate.seconds*1000).toDateString()}</p>
                        <p key={Math.random()}>{el.street}</p>
                        <p key={Math.random()}>{el.city}</p>
                        <p key={Math.random()}>{el.state}</p>
                        <p key={Math.random()}>{el.zip}</p>
                        <span className='delete'><i className="fas fa-pen-alt"></i><i onClick={() => handleDelete(el.id, el.firstName)} className="fas fa-trash"></i></span>
                    </div>
                })}
                    </div>
        {employeeDeleted ? <Modal message={deleteMessage} handleResponse={handleModalResponse} /> : ''}
        </div> : <div className='error'><h3>Oooops, something went wrong when fetching datas...</h3></div>}
        </div>
            
    );
}

export default EmployeeList;