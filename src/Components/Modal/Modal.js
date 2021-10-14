import { useState } from 'react';
import './Modal.css';

function Modal(props) {

    const [visible, setVisible] = useState(true);
    
    const handleUserClick = (data) => {
        props.handleResponse(data)
    }

    return (<div>
        {visible ? <div className='modal'>
            <p className='modal__text'>{props.message}</p>
            <button className='modal__button' onClick={() => {setVisible(false); handleUserClick('click')}}>OKAY!</button>
        </div> : ''}
    </div>

    );
}

export default Modal;