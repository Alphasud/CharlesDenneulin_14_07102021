import { useState, useEffect } from "react";
import db from "../firebaseConfig";


/**
 * Component for login.
 *
 * @component
 */
function LoginModal(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [logError, setLogError] = useState(false);
    const [user, setUser] = useState();

/**
 * <Validate form>
 */
    const validate = () => {
        let emailErrorMessage = '';
        let passwordErrorMessage = '';
        if (!email) { emailErrorMessage = 'Please, enter your username.' };
        if (!password) { passwordErrorMessage = 'Please, enter your password.' };
        if (passwordErrorMessage || emailErrorMessage) {
        setEmailError(emailErrorMessage);
        setPasswordError(passwordErrorMessage);
        return false;
        }
        return true;
    };

    const fetchData = async () => {
        let userArray = [];
            try {
                const data = await db.collection('user').get();
                data.docs.map(el => {
                    let user = { ...el.data(), 'id': el.id}
                    userArray.push(user);
                    return  userArray;
                });
              setUser(userArray)
            } catch (e) {
              console.log(e);
            }
    }

    useEffect(() => {
        fetchData()
    }, [])

/**
 * <Handles submission>
 */
  const handleSubmit = (event) => {
      event.preventDefault();
      if (validate()) {
          setEmailError('');
          setPasswordError('');
          const trueUsername = user.map(el => el.username);
          const truePassword = user.map(el => el.password);
          if (trueUsername.toLocaleString() === email && truePassword.toLocaleString() === password) {
              setLogError(false);
              props.handleResponse('success');
          } else {
              setLogError(true);
          }
        
      };
  };

    return (
                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <label htmlFor="email">Email</label>
                        <input
                            name="username"
                            type="text"
                            id="username"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        { emailError ? <div className="form-error">{emailError}</div> : null  }  
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        { passwordError ? <div className="form-error">{passwordError}</div> : null  }  
                    </div>
                    <button className="sign-in-button" type="submit">Log-In</button>
                    {logError ? <div className="login-error">Invalid credentials.</div> : null}
                </form>
    )
}

export default LoginModal;