import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../firebaseConfig';
import { Modal } from 'modal-cd';
import UpdateModal from './UpdateModal';
import LoginModal from './LoginModal';

function EmployeeList(props) {
    const [isLogged, setIsLogged] = useState(props.auth);
    const [loginModal, setLoginModal] = useState(false);
    const [messageToLogin, setMessageToLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [entriesSelected, setEntriesSelected] = useState(10);
    const [fullArray, setFullArray] = useState(props.employees);
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

    const [numberOfPages, setNumberOfPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    const [isUpdating, setIsUpdating] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});


    const createGroups = (arr, entries) => {
        const pages = Math.ceil(arr.length / entries);
        //const perGroup = Math.ceil(arr.length / pages); // equal number of entries per pages. 
        const perGroup = entries; // number of entries per pages is specified by entry user choice.
        setNumberOfPages(pages);
        return new Array(pages)
        .fill('')
        .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
    }

    const fetchData = async () => {
            let employeeArray = [];
            try {
                const data = await db.collection('employee').get();
                data.docs.map(el => {
                    let employee = { ...el.data(), 'id': el.id }
                    employeeArray.push(employee);
                    return employeeArray;
                });
                employeeArray.length > 0 ? setIsLoading(false) : setIsLoading(true);
                setFullArray(employeeArray);
                setEmployees(createGroups(employeeArray, entriesSelected));
            } catch (e) {
                setError(true);
            } 
    }

    useEffect(() => {
        props.employees.length > 0 ? setIsLoading(false) : setIsLoading(true);
        setFullArray(props.employees);
        setEmployees(createGroups(props.employees, entriesSelected));
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.employees]);
    
     useEffect(() => {
       // fetchData();
        setCurrentPage(1);
        setEmployees(createGroups(fullArray, entriesSelected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entriesSelected] );

    const sortArray = (name, type) => {
        if (type === 'ascending') {
            const sorted = [...fullArray].sort((a, b) => a[name] > b[name]);
            setEmployees(createGroups(sorted, entriesSelected));
        }
        if (type === 'descending') {
            const sorted = [...fullArray].sort((a, b) => a[name] < b[name]);
            setEmployees(createGroups(sorted, entriesSelected));
        }
        if (type === 'number-ascending') {
            const sorted = [...fullArray].sort((a, b) => a[name] - b[name]);
            setEmployees(createGroups(sorted, entriesSelected));
        }
        if (type === 'number-descending') {
            const sorted = [...fullArray].sort((a, b) => b[name] - a[name]);
            setEmployees(createGroups(sorted, entriesSelected));
        }
    }

    const handleSearch = (e) => {
        setEmployees(createGroups(fullArray, entriesSelected))
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
        setEmployees(createGroups(searchedWithoutDuplicate, entriesSelected));
        setCurrentPage(1);


        if (!e.target.value) {
            setEmployees(createGroups(fullArray, entriesSelected))
        }
    }

    const handleDelete = (id, firstName) => {
        if (isLogged) {
            console.log(`Delete user with id: ${id}`);
            try {
                db.collection('employee').doc(id).delete();
                setIsVisibile(true);
                setDeleteMessage(`Gotcha! ${firstName} is no longer in the team ;)`);
            } catch (error) {
                console.log('Error deleting employee');
                console.log(error);
            }
        } else {setMessageToLogin(true)}
    }
    const handleClick = (data) => {
        if (data) {
            setIsUpdating(false);
            fetchData();
        }
    }
    
    const handleModalResponse = (data) => {
        if (data) {
            setIsVisibile(false);
            setDeleteMessage('');
            fetchData();
        }
    }
    const handleMessageLoginResponse = (data) => {
        if (data) { setMessageToLogin(false) };
    }

    const getResponseFromLoginModal = (data) => {
        if (data === 'success') {
            setLoginModal(false);
            setIsLogged(true)
            props.handleLogState(data);
        };
    }

    const handlePreviousPage = () => {
        let page = currentPage - 1;
        if (page < 1) page = 1;
        setCurrentPage(page);
    }
    const handleNextPage = () => {
        let page = currentPage + 1;
        if (page > numberOfPages) page = numberOfPages;
        setCurrentPage(page);
    }

   const totalLength = () => {
        let entries = 0;
        for (let x = 0; x < employees.length; x++) {
            entries += employees[x].length;
        }
       return entries;
    }

    return (
        <div className='employee-page'>
        <div className={isUpdating || loginModal ? 'employee-page__container focusout' : 'employee-page__container'}>
        <h1 className='title'>Current Employees</h1>
                <div className="log" onClick={() => { isLogged ? setIsLogged(false) : setLoginModal(true) }}>{isLogged ? 'Logout' : 'Login'}</div>
        <p className='entries'>Total: {fullArray.length} {fullArray.length > 1 ? 'employees' : 'employee'}</p>
        {isLogged ? <Link className="employee__link" to='/add-employee'>Add Employee</Link> : <div className='employee__link' onClick={() => setMessageToLogin(true)}>Add Employee</div>}
        <div className='employee__search'>
            <label htmlFor="search">Search :</label>
                <input name='search' type="text" onInput={(e) => handleSearch(e)}/>
            </div>
            <div className="entries">
                <p>Entries per page : </p>
                <span className={entriesSelected === 10 ? 'selected': ''} onClick={() => setEntriesSelected(10)}>10</span>
                <span className={entriesSelected === 25 ? 'selected': ''} onClick={() => setEntriesSelected(25)}>25</span>
                <span className={entriesSelected === 50 ? 'selected': ''} onClick={() => setEntriesSelected(50)}>50</span>
                <span className={entriesSelected === 100 ? 'selected': ''} onClick={() => setEntriesSelected(100)}>100</span>
            </div>
            <p className='entry-message'>Showing page {currentPage} out of {numberOfPages} {numberOfPages > 1 ? 'pages' : 'page'} for a total of {totalLength()} {totalLength() > 1 ? 'entries' : 'entry'}.</p>
        {numberOfPages > 1 ? <div className="page-selector">
            <span onClick={handlePreviousPage}><i className="fas fa-chevron-left"></i>Previous</span>
            <span onClick={handleNextPage}>Next<i className="fas fa-chevron-right"></i></span>
        </div> : null}
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
        <div className='page'>
            { totalLength() > 0 ? employees.map((el, index) => {
               return <div key={Math.random()} className={index + 1 === currentPage ? 'list__employees shown' : 'list__employees'}>
                   {el.map(ele => {
                    return <div key={ele.id} className='list__employee'>
                    <p key={Math.random()}>{ele.firstName}</p>
                    <p key={Math.random()}>{ele.lastName}</p>
                    <p key={Math.random()}>{new Date(ele.startDate.seconds*1000).toDateString()}</p>
                    <p key={Math.random()}>{ele.department}</p>
                    <p key={Math.random()}>{new Date(ele.birthDate.seconds*1000).toDateString()}</p>
                    <p key={Math.random()}>{ele.street}</p>
                    <p key={Math.random()}>{ele.city}</p>
                    <p key={Math.random()}>{ele.state}</p>
                    <p key={Math.random()}>{ele.zip}</p>
                        <span className='modify'>
                            <i onClick={() => {
                                if (isLogged) {
                                    setIsUpdating(true); setUpdatedUser({
                                        firstName: ele.firstName,
                                        lastName: ele.lastName,
                                        birthDate: ele.birthDate,
                                        startDate: ele.startDate,
                                        street: ele.street,
                                        city: ele.city,
                                        state: ele.state,
                                        zip: ele.zip,
                                        department: ele.department,
                                        id: ele.id
                                    })
                                } else {setMessageToLogin(true)}
                            }} className="fas fa-pen-alt">
                            </i>
                            <i onClick={() => handleDelete(ele.id, ele.firstName)} className="fas fa-trash"></i>
                        </span>
                    </div>
                   })}
                </div>
                })
            : <div className='loading-spinner'>{isLoading ? <i className="fas fa-sync-alt fa-2x"></i> : 'No datas'}</div>
            }
        </div>       
        <Modal visible={isVisible} message={deleteMessage} buttonMessage='OKAY!' handleResponse={handleModalResponse}/>
        </div> : <div className='error'><h3>Oooops, something went wrong when fetching datas...</h3></div>}
        </div>
        
        {isUpdating ? <div className='update-modal'>
           <span><i onClick={() => setIsUpdating(false)} className="fas fa-times fa-2x"></i></span> 
           <UpdateModal data={updatedUser} handleResponse={handleClick} />     
        </div> : null}
        
        <Modal visible={messageToLogin} message='You need to be logged in to add, update or delete an employee.' buttonMessage='OKAY!' handleResponse={handleMessageLoginResponse}/>

        {loginModal ? <div className='log-modal'>
           <span><i onClick={() => setLoginModal(false)} className="fas fa-times fa-2x"></i></span> 
           <LoginModal handleResponse={getResponseFromLoginModal} />    
        </div> : null}
        </div>
            
    );
}

export default EmployeeList;

/* handleUpdate(ele.id, ele.firstName, ele.lastName, ele.startDate, ele.department, ele.birthDate, ele.street, ele.city, ele.state, ele.zip) */