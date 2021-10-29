import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../firebaseConfig';
import { Modal } from 'modal-cd';

function EmployeeList() {
    
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [isVisible, setIsVisibile] = useState(false);
    const [sortType, setSortType] = useState('');

    const [isFirstNameClicked, setIsFirstNameClicked] = useState(false);
    const [isLastNameClicked, setIsLastNameClicked] = useState(false);
    const [isBirthDateClicked, setIsBirthDateClickedClicked] = useState(false);
    const [isStartDateClicked, setIsStartDateClicked] = useState(false);
    const [isStreetClicked, setIsStreetClicked] = useState(false);
    const [isCityClicked, setIsCityClicked] = useState(false);
    const [isStateClicked, setIsStateClicked] = useState(false);
    const [isZipClicked, setIsZipClicked] = useState(false);
    const [isDepartmentClicked, setIsDepartmentClicked] = useState(false);

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

    useEffect(() => {
        const sortArray = (type) => {
            const types = {
                firstName: 'firstName',
                lastName: 'lastName',
                birthDate: 'birthDate',
                startDate: 'startDates',
                street: 'street',
                city: 'city',
                state: 'state',
                zip: 'zip',
                department: 'department'
            }
            const sortProperty = types[type];
            const sorted = [...employees].sort((a, b) => a[sortProperty] > b[sortProperty]);
            setEmployees(sorted);
        };
        sortArray(sortType)
    }, [sortType]);

    const handleDelete = (id, firstName) => {
        console.log(`Delete user with id: ${id}`);
        try {
            db.collection('employee').doc(id).delete();
            setIsVisibile(true);
            setDeleteMessage(`Gotcha! ${firstName} is no longer in the team ;)`);
        } catch (error) {
            console.log('Error deleting employee');
            console.log(error);
        }
    }
    const handleModalResponse = (data) => {
        if (data) {
            setIsVisibile(false);
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
                        <div className='heading'>First Name <i class={!isFirstNameClicked ? ' fas fa-chevron-up' : 'fas fa-chevron-down'} onClick={() => { setIsFirstNameClicked(!isFirstNameClicked); setSortType('firstName')}}></i></div>
                <div className='heading'>Last Name <i class="fas fa-chevron-up" onClick={() => setSortType('lastName')}></i></div>
                <div className='heading'>Start Date <i class="fas fa-chevron-up"></i></div>
                <div className='heading'>Department <i class="fas fa-chevron-up"></i></div>
                <div className='heading'>Date of Birth <i class="fas fa-chevron-up"></i></div>
                <div className='heading'>Street <i class="fas fa-chevron-up"></i></div>
                <div className='heading'>City <i class="fas fa-chevron-up"></i></div>
                <div className='heading'>State <i class="fas fa-chevron-up"></i></div>
                <div className='heading'>Zip Code <i class="fas fa-chevron-up"></i></div>
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
        <Modal visible={isVisible} message={deleteMessage} buttonMessage='OKAY!' handleResponse={handleModalResponse}/>
        </div> : <div className='error'><h3>Oooops, something went wrong when fetching datas...</h3></div>}
        </div>
            
    );
}

export default EmployeeList;