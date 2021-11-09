import { useState } from 'react';
import Dropdown from './Dropdown/Dropdown';
import db from '../firebaseConfig';
import { Modal } from 'modal-cd';

/**
 * Component for updating an employee.
 *
 * @component
 */
function UpdateModal(props) {
    const departments = ['Sales', 'Marketing', 'Engineering', 'Human Ressources', 'Legal'];
    const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    

    const [firstName, setFirstName] = useState(props.data.firstName);
    const [lastName, setLastName] = useState(props.data.lastName);
    const birthDate = props.data.birthDate;
    const startDate = props.data.startDate;
    const [street, setStreet] = useState(props.data.street);
    const [city, setCity] = useState(props.data.city);
    const [state, setState] = useState('');
    const [zip, setZip] = useState(props.data.zip);
    const [department, setDepartment] = useState('');

    const [error, setError] = useState(false);
    const [addEmployeeMessage, setAddEmployeeMessage] = useState('');
    const [isVisible, setIsVisibile] = useState(false);

    const handleStateResponse = (data) => {
        setState(data)
    }
    const handleDepartmentResponse = (data) => {
        setDepartment(data)
    }
    const handleUserClick = (data) => {
        props.handleResponse(data)
    }
    const handleModalResponse = (data) => {
        if (data) {
            setIsVisibile(false);
            setAddEmployeeMessage('');
            handleUserClick('click');
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
                db.collection('employee').doc(props.data.id).update({
                    firstName: firstName,
                    lastName: lastName,
                    street: street,
                    city: city,
                    state: state,
                    zip: zip,
                    department: department
                });
                setIsVisibile(true);
                setAddEmployeeMessage(`Success! ${firstName} Was Updated :)`);
            } catch (error) {
                setError(true);
            }
        }
    }
    return (
        <>
        <div className="update-container">
            <h2>Update a Member's Information ✏️</h2>
            <form>
                <div className="credentials">
                    <label htmlFor="first-name">First Name</label>
                    <input className='input' type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                    {firstNameError ? <div className="form-error">{firstNameError}</div> : null}

                    <label htmlFor="last-name">Last Name</label>
                    <input className='input' type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                    {lastNameError ? <div className="form-error">{lastNameError}</div> : null}

                    <label htmlFor="date-of-birth">Date of Birth</label>
                        <input className='input' readOnly value={new Date(birthDate.seconds*1000).toDateString()} />
                    
                    <label htmlFor="start-date">Start Date</label>
                        <input className='input' readOnly value={new Date(startDate.seconds*1000).toDateString()} />
                </div>
                <div className="address">
                    <label htmlFor="street">Street</label>
                    <input className='input' type="text" value={street} onChange={(event) => setStreet(event.target.value)} />
                    {streetError ? <div className="form-error">{streetError}</div> : null}

                    <label htmlFor="city">City</label>
                    <input className='input' type="text" value={city} onChange={(event) => setCity(event.target.value)} />
                    {cityError ? <div className="form-error">{cityError}</div> : null}

                    <label htmlFor="state">State</label>
                    <Dropdown data={states} name='state' handleResponse={handleStateResponse} />
                    {stateError ? <div className="form-error">{stateError}</div> : null}

                    <label htmlFor="zip-code">Zip Code</label>
                    <input className='input' type="number" value={zip} onChange={(event) => setZip(event.target.value)} />
                    {zipError ? <div className="form-error">{zipError}</div> : null}
                </div>

                <div className="department">
                     <label htmlFor="department">Department</label>
                    <Dropdown data={departments} name='department' handleResponse={handleDepartmentResponse} />
                    {departmentError ? <div className="form-error">{departmentError}</div> : null}
                </div>
            </form>
            <button onClick={handleSubmit}>Add!</button>
        </div>
        <Modal visible={isVisible} message={addEmployeeMessage} buttonMessage='OKAY!' handleResponse={handleModalResponse} />
        {error ? <Modal visible={true} message='Ooops, something went wrong...' buttonMessage='OKAY...' handleResponse={handleModalResponse} /> : ''}
    </>
  );
}

export default UpdateModal;