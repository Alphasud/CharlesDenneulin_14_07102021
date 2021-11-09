import './Dropdown.css';
import { useEffect, useRef, useState } from 'react';

/**
 * Dropdown menu component.
 *
 * @component
 */
function Dropdown(props) {

    const [isComponentVisible, setIsComponentVisible] = useState(false);
    const [choice, setChoice] = useState('');

    const ref = useRef(null);
    const title = useRef(null)

    const handleClick = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
        }
        if (!isComponentVisible && title.current && title.current.contains(event.target)) {
            setIsComponentVisible(true)
        }
    };

  useEffect(() => {
      document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  });
    
    useEffect(() => {
        setChoice('')
    }, [props.reset])
    
    const handleChange = (data) => {
        props.handleResponse(data)
    }
 
    return (
        <div className='dropdown__container'>
            <div ref={title} className='dropdown__title' onClick={() => handleClick}>
                <h1>{!choice ? `Select a ${props.name}` : choice}</h1>
                {isComponentVisible ?
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-up" className="svg-inline--fa fa-chevron-up fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg>
                    :
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" className="svg-inline--fa fa-chevron-down fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>
                }
            </div>
            <div ref={ref} className={isComponentVisible ? "dropdown visible" : "dropdown" }>
                    <div className="dropdown__container__list">
                            {props.data.map(el => {
                                return <div key={Math.random()} className="dropdown__container__list__item" onClick={() => { setChoice(el); setIsComponentVisible(false); handleChange(el) }}>{el}</div>
                        })}
                    </div>
            </div>
        </div>
    );
}

export default Dropdown;