import { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from './DatePicker/DatePicker';
import Dropdown from './Dropdown/Dropdown';
import Modal from './Modal/Modal';
import db from '../firebaseConfig';

function HomePage() {
    const departments = ['Sales', 'Marketing', 'Engineering', 'Human Ressources', 'Legal'];
    const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState();
    const [startDate, setStartDate] = useState();
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [department, setDepartment] = useState('');

    const [resetBirth, setResetBirth] = useState(Math.random());
    const [resetStart, setResetstart] = useState(Math.random());
    const [reset, setReset] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submit');
        const user = {
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            startDate: startDate,
            street: street,
            city: city,
            state: state,
            zip: zip,
            department: department
        }
        console.log(user);
        try {
            console.log('Succes!');
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
            setSuccess(true);
        } catch(error) {
            console.log('Error sending datas');
            setError(true);
        }
        

        setResetBirth(Math.random());
        setResetstart(Math.random());
        setReset(!reset);
        setFirstName('');
        setLastName('');
        setStreet('');
        setCity('');
        setZip(0);

    }

    return ( <>
        <div className="title">
            <h1>HR.net</h1>
        </div>
        <div className="container">
            <Link className="link" to='/employeeList'>View Current Employees</Link>
            <h2>Create Employee</h2>
            <form>
                <div className="credentials">
                    <label htmlFor="first-name">First Name</label>
                    <input className='input' type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} />

                    <label htmlFor="last-name">Last Name</label>
                    <input className='input' type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />

                    <label htmlFor="date-of-birth">Date of Birth</label>
                    <DatePicker handleResponse={handleBirthDateResponse} key={resetBirth}/>
                    
                    <label htmlFor="start-date">Start Date</label>
                    <DatePicker handleResponse={handleStartDateResponse} key={resetStart}/>
                </div>
                <div className="address">
                    <label htmlFor="street">Street</label>
                    <input className='input' type="text" value={street} onChange={(event) => setStreet(event.target.value)} />

                    <label htmlFor="city">City</label>
                    <input className='input' type="text" value={city} onChange={(event) => setCity(event.target.value)} />

                    <label htmlFor="state">State</label>
                    <Dropdown reset={reset} data={states} name='state' handleResponse={handleStateResponse} />

                    <label htmlFor="zip-code">Zip Code</label>
                    <input className='input' type="number" value={zip} onChange={(event) => setZip(event.target.value)} />
                </div>

                <div className="department">
                     <label htmlFor="department">Department</label>
                    <Dropdown reset={reset} data={departments} name='department' handleResponse={handleDepartmentResponse}/>
                </div>
            </form>
            <button onClick={handleSubmit}>Save</button>
        </div>
        {success ? <Modal message='Success! You added a new employee!' /> : ''}
        {error ? <Modal message='Ooops, something went wrong...' /> : ''}
    </>
  );
}

export default HomePage;