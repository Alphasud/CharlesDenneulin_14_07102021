
function EmployeeList(props) {
    const employees = props.employees;
    
    return (<>
        <h1 className='title'>Current Employees</h1>
        <div className='headings'>
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
        <div className='list'>
            <div className='list__item'>
                {employees.map(el => {
                    return <p key={el.id}>{el.firstName}</p>
                })}
            </div>
            <div className='list__item'>
                {employees.map(el => {
                    return <p key={el.id}>{el.lastName}</p>
                })}
            </div>
            <div className='list__item'>
                {employees.map(el => {
                    return <p key={el.id}>{new Date(el.startDate.seconds*1000).toDateString()}</p>
                })}
            </div>
            <div className='list__item'>
                {employees.map(el => {
                    return <p key={el.id}>{el.department}</p>
                })}
            </div>
            <div className='list__item'>
                {employees.map(el => {
                    return <p key={el.id}>{new Date(el.birthDate.seconds*1000).toDateString()}</p>
                })}
            </div>
            <div className='list__item'>
                {employees.map(el => {
                    return <p key={el.id}>{el.street}</p>
                })}
            </div>
            <div className='list__item'>
                {employees.map(el => {
                    return <p key={el.id}>{el.city}</p>
                })}
            </div>
            <div className='list__item'>
                {employees.map(el => {
                    return <p key={el.id}>{el.state}</p>
                })}
            </div>
            <div className='list__item'>
                {employees.map(el => {
                    return <p key={el.id}>{el.zip}</p>
                })}
            </div>
        </div>
        </>
    );
}

export default EmployeeList;