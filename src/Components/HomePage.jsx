import { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from './DatePicker/DatePicker';
import Dropdown from './Dropdown/Dropdown';
import db from '../firebaseConfig';
import { Modal } from 'modal-cd';

function HomePage(props) {
    const departments = ['Sales', 'Marketing', 'Engineering', 'Human Ressources', 'Legal'];
    const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [department, setDepartment] = useState('');

    const [resetBirth, setResetBirth] = useState(Math.random());
    const [resetStart, setResetstart] = useState(Math.random());
    const [reset, setReset] = useState(false);
    const [error, setError] = useState(false);
    const [addEmployeeMessage, setAddEmployeeMessage] = useState('');

    const [isVisible, setIsVisibile] = useState(false);


    const handleStateResponse = (data) => {
        setState(data)
    }
    const handleDepartmentResponse = (data) => {
        setDepartment(data)
    }
    const handleBirthDateResponse = (data) => {
        setBirthDate(data)
    }
    const handleStartDateResponse = (data) => {
        setStartDate(data)
    }
    const handleModalResponse = (data) => {
        if (data) {
            setIsVisibile(false);
            setAddEmployeeMessage('');
        }
    }
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [streetError, setSteetError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');
    const [zipError, setZipError] = useState('');
    const [departmentError, setDepartmentError] = useState('');


  const validate = () => {

    let firstNameErrorMessage = '';
    let lastNameErrorMessage = '';
    let streetErrorMessage = '';
    let cityErrorMessage = '';
    let stateErrorMessage = '';
    let zipErrorMessage = '';
    let departmentErrorMessage = '';
      
    if (!firstName) { firstNameErrorMessage = 'Please, enter a first name.' };
    if (!lastName) { lastNameErrorMessage = 'Please, enter a last name.' };
    if (!street) { streetErrorMessage = 'Please, enter a street.' };
    if (!city) { cityErrorMessage = 'Please, enter a city.' };
    if (!state) { stateErrorMessage = 'Please, select a state.' };
    if (!zip) { zipErrorMessage = 'Please, enter a zip code.' };
    if (!department) { departmentErrorMessage = 'Please, select a department.' };

    if (firstNameErrorMessage || lastNameErrorMessage || streetErrorMessage || cityErrorMessage || stateErrorMessage || zipErrorMessage || departmentErrorMessage) {

        setFirstNameError(firstNameErrorMessage);
        setLastNameError(lastNameErrorMessage);
        setSteetError(streetErrorMessage);
        setCityError(cityErrorMessage);
        setStateError(stateErrorMessage);
        setZipError(zipErrorMessage);
        setDepartmentError(departmentErrorMessage);

      return false;
    }

      return true;
  };

    const handleSubmit = (e) => {
        if (validate()) {
            e.preventDefault();
            try {
                db.collection('employee').add({
                    firstName: firstName,
                    lastName: lastName,
                    birthDate: birthDate,
                    startDate: startDate,
                    street: street,
                    city: city,
                    state: state,
                    zip: zip,
                    department: department
                });
                setIsVisibile(true);
                setAddEmployeeMessage(`Success! ${firstName} is now part of our team :)`);
            } catch (error) {
                setError(true);
            }

            setFirstNameError('');
            setLastNameError('');
            setSteetError('');
            setCityError('');
            setStateError('');
            setZipError('');
            setDepartmentError('');
        
            setResetBirth(Math.random());
            setResetstart(Math.random());
            setReset(!reset);
            setFirstName('');
            setLastName('');
            setStreet('');
            setCity('');
            setZip(0);
        }
    }

    return ( <>
        <div className="title">
            <h1>HR.net</h1>
        </div>
        {props.auth ? <div className="container">
            <Link className="link" to='/'>View Current Employees</Link>
            <h2>Add a New Member to the Team ✏️</h2>
            <form>
                <div className="credentials">
                    <label htmlFor="first-name">First Name</label>
                    <input className='input' id='first-name' type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                    {firstNameError ? <div className="form-error">{firstNameError}</div> : null}

                    <label htmlFor="last-name">Last Name</label>
                    <input id="last-name" className='input' type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                    {lastNameError ? <div className="form-error">{lastNameError}</div> : null}

                    <label htmlFor="date-of-birth">Date of Birth</label>
                    <DatePicker handleResponse={handleBirthDateResponse} key={resetBirth}/>
                    
                    <label htmlFor="start-date">Start Date</label>
                    <DatePicker handleResponse={handleStartDateResponse} key={resetStart}/>
                </div>
                <div className="address">
                    <label htmlFor="street">Street</label>
                    <input id="street" className='input' type="text" value={street} onChange={(event) => setStreet(event.target.value)} />
                    {streetError ? <div className="form-error">{streetError}</div> : null}

                    <label htmlFor="city">City</label>
                    <input id='city' className='input' type="text" value={city} onChange={(event) => setCity(event.target.value)} />
                    {cityError ? <div className="form-error">{cityError}</div> : null}

                    <label htmlFor="state">State</label>
                    <Dropdown reset={reset} data={states} name='state' handleResponse={handleStateResponse} />
                    {stateError ? <div className="form-error">{stateError}</div> : null}

                    <label htmlFor="zip-code">Zip Code</label>
                    <input id='zip-code' className='input' type="number" value={zip} onChange={(event) => setZip(event.target.value)} />
                    {zipError ? <div className="form-error">{zipError}</div> : null}
                </div>

                <div className="department">
                     <label htmlFor="department">Department</label>
                    <Dropdown reset={reset} data={departments} name='department' handleResponse={handleDepartmentResponse} />
                    {departmentError ? <div className="form-error">{departmentError}</div> : null}
                </div>
            </form>
            <button onClick={handleSubmit}>Add!</button>
        </div> : <div className="unauthorized"><div>Unauthorized ! How did you get there ? You must be logged-in to access this page</div><div><Link className="link" to='/'>Go Back</Link></div></div>}
        <Modal visible={isVisible} message={addEmployeeMessage} buttonMessage='OKAY!' handleResponse={handleModalResponse} />
        {error ? <Modal visible={true} message='Ooops, something went wrong...' buttonMessage='OKAY...' handleResponse={handleModalResponse} /> : ''}
    </>
  );
}

export default HomePage;