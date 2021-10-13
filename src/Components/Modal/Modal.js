import { useState } from 'react';
import './Modal.css';

function Modal(props) {

    const [visible, setVisible] = useState(true);

    return (<div>
        {visible ? <div className='modal'>
            <p className='modal__text'>{props.message}</p>
            <button className='modal__button' onClick={() => setVisible(false)}>OKAY!</button>
        </div> : ''}
    </div>

    );
}

export default Modal;