import { Link } from 'react-router-dom';
import DatePicker from './DatePicker/DatePicker';
import Dropdown from './Dropdown/Dropdown';

function HomePage() {
    const departments = ['Sales', 'Marketing', 'Engineering', 'Human Ressources', 'Legal'];

    return ( <>
        <div className="title">
            <h1>HR.net</h1>
        </div>
        <div className="container">
            <Link className="link" to='/employeeList'>View Current Employees</Link>
            <h2>Create Employee</h2>
            <form action="#" id="create-employee">
                <div className="credentials">
                    <label htmlFor="first-name">First Name</label>
                    <input className='input' type="text" id="first-name" />

                    <label htmlFor="last-name">Last Name</label>
                    <input className='input' type="text" id="last-name" />

                    <label htmlFor="date-of-birth">Date of Birth</label>
                    <DatePicker />
                    
                    <label htmlFor="start-date">Start Date</label>
                    <DatePicker />
                </div>
                <div className="address">
                    <label htmlFor="street">Street</label>
                    <input className='input' id="street" type="text" />

                    <label htmlFor="city">City</label>
                    <input className='input' id="city" type="text" />

                    <label htmlFor="state">State</label>
                    <select name="state" id="state" defaultValue={'default'}>
                        <option value="default">Select a State</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                    </select>

                    <label htmlFor="zip-code">Zip Code</label>
                    <input className='input' id="zip-code" type="number" />
                </div>

                <div className="department">
                     <label htmlFor="department">Department</label>
                    {/*<select name="department" id="department" defaultValue={'default'}>
                    <option value="default">Select a department</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Legal</option>
                </select> */}
                    <Dropdown departments={departments} />
                </div>
                
            </form>
            
            <button>Save</button>
        </div>
    </>
  );
}

export default HomePage;