import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../firebaseConfig';
import { Modal } from 'modal-cd';

function EmployeeList() {
    const [fullArray, setFullArray] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [isVisible, setIsVisibile] = useState(false);

    const [isFirstNameClicked, setIsFirstNameClicked] = useState(false);
    const [isLastNameClicked, setIsLastNameClicked] = useState(false);
    const [isBirthDateClicked, setIsBirthDateClicked] = useState(false);
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
                setFullArray(employeeArray);
            } catch (e) {
                setError(true);
            } 
        }

    useEffect(() => {
        fetchData();
    }, []);

    const sortArray = (name, type) => {
        if (type === 'ascending') {
            const sorted = [...employees].sort((a, b) => a[name] > b[name]);
            setEmployees(sorted);
        }
        if (type === 'descending') {
            const sorted = [...employees].sort((a, b) => a[name] < b[name]);
            setEmployees(sorted);
        }
        if (type === 'number-ascending') {
            const sorted = [...employees].sort((a, b) => a[name] - b[name]);
            setEmployees(sorted);
        }
        if (type === 'number-descending') {
            const sorted = [...employees].sort((a, b) => b[name] - a[name]);
            setEmployees(sorted);
        }
    }

    const handleSearch = (e) => {
        setEmployees(fullArray)

        const arrayOfEmployees = fullArray;

        const searchedFirstName = [...arrayOfEmployees].filter(el => {
            return el.firstName.toLowerCase().includes(e.target.value.toLowerCase());
        });
        const searchedLastName = [...arrayOfEmployees].filter(el => {
            return el.lastName.toLowerCase().includes(e.target.value.toLowerCase());
        });
        const searchedDepartment = [...arrayOfEmployees].filter(el => {
            return el.department.toLowerCase().includes(e.target.value.toLowerCase());
        });
        const searchedStreet = [...arrayOfEmployees].filter(el => {
            return el.street.toLowerCase().includes(e.target.value.toLowerCase());
        });
        const searchedCity = [...arrayOfEmployees].filter(el => {
            return el.city.toLowerCase().includes(e.target.value.toLowerCase());
        });
        const searchedState = [...arrayOfEmployees].filter(el => {
            return el.state.toLowerCase().includes(e.target.value.toLowerCase());
        });
        const searchedZip = [...arrayOfEmployees].filter(el => {
            return el.zip.toString().includes(e.target.value.toLowerCase());
        });
        const searched = [
            ...searchedFirstName,
            ...searchedLastName,
            ...searchedDepartment,
            ...searchedStreet,
            ...searchedCity,
            ...searchedState,
            ...searchedZip
            ];
        
        const searchedWithoutDuplicate = [...new Set(searched)];
        setEmployees(searchedWithoutDuplicate);
        
        if (!e.target.value) {
            setEmployees(fullArray);
        }
    }

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
        <div className ='employee-page'>
        <h1 className='title'>Current Employees</h1>
        <Link className="employee__link" to='/'>Add Employee</Link>
        <div className='employee__search'>
            <label htmlFor="search">Search</label>
                <input name='search' type="text" onInput={(e) => handleSearch(e)}/>
        </div>
        { !error ? 
        <div className='employee-container'>
            <div className='headings-container'>
                <div className='heading'>First Name <i className={!isFirstNameClicked ? ' fas fa-chevron-up' : 'fas fa-chevron-down'} onClick={() => { setIsFirstNameClicked(!isFirstNameClicked); !isFirstNameClicked ? sortArray('firstName', 'ascending') : sortArray('firstName', 'descending')}}></i></div>
                <div className='heading'>Last Name <i className={!isLastNameClicked ? ' fas fa-chevron-up' : 'fas fa-chevron-down'} onClick={() => { setIsLastNameClicked(!isLastNameClicked); !isLastNameClicked ? sortArray('lastName', 'ascending') : sortArray('lastName', 'descending')}}></i></div>
                <div className='heading'>Start Date <i className={!isStartDateClicked ? ' fas fa-chevron-up' : 'fas fa-chevron-down'} onClick={() => { setIsStartDateClicked(!isStartDateClicked); !isStartDateClicked ? sortArray('startDate', 'number-ascending') : sortArray('startDate', 'number-descending')}}></i></div>
                <div className='heading'>Department <i className={!isDepartmentClicked ? ' fas fa-chevron-up' : 'fas fa-chevron-down'} onClick={() => { setIsDepartmentClicked(!isDepartmentClicked); !isDepartmentClicked ? sortArray('department', 'ascending') : sortArray('department', 'descending')}}></i></div>
                <div className='heading'>Date of Birth <i className={!isBirthDateClicked ? ' fas fa-chevron-up' : 'fas fa-chevron-down'} onClick={() => { setIsBirthDateClicked(!isBirthDateClicked); !isBirthDateClicked ? sortArray('birthDate', 'number-ascending') : sortArray('birthDate', 'number-descending')}}></i></div>
                <div className='heading'>Street <i className={!isStreetClicked ? ' fas fa-chevron-up' : 'fas fa-chevron-down'} onClick={() => { setIsStreetClicked(!isStreetClicked); !isStreetClicked ? sortArray('street', 'ascending') : sortArray('street', 'descending')}}></i></div>
                <div className='heading'>City <i className={!isCityClicked ? ' fas fa-chevron-up' : 'fas fa-chevron-down'} onClick={() => { setIsCityClicked(!isCityClicked); !isCityClicked ? sortArray('city', 'ascending') : sortArray('city', 'descending')}}></i></div>
                <div className='heading'>State <i className={!isStateClicked ? ' fas fa-chevron-up' : 'fas fa-chevron-down'} onClick={() => { setIsStateClicked(!isStateClicked); !isStateClicked ? sortArray('state', 'ascending') : sortArray('state', 'descending')}}></i></div>
                <div className='heading'>Zip Code <i className={!isZipClicked ? ' fas fa-chevron-up' : 'fas fa-chevron-down'} onClick={() => { setIsZipClicked(!isZipClicked); !isZipClicked ? sortArray('zip', 'number-ascending') : sortArray('zip', 'number-descending')}}></i></div>
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