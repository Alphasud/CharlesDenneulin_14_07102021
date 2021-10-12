import './Dropdown.css';
import { useEffect, useRef, useState } from 'react';

/* 
    * Custom hook to manage display
*/
function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref = useRef(null);

  const handleHideDropdown = (event) => {
    if (event.key === "Escape") {
      setIsComponentVisible(false);
    }
  };

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}

function Dropdown(props) {

const {
    ref,
    isComponentVisible,
    setIsComponentVisible
    } = useComponentVisible(false);
    
    console.log(isComponentVisible);
 
    const [choice, setChoice] = useState('');
    console.log(choice);
    return (
        <div className='dropdown__container'>
            <div className='dropdown__title'>
                <h1>{!choice ? 'Select a department' : choice}</h1>
                {isComponentVisible ?
                    <svg onClick={() => setIsComponentVisible(false)} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-up" className="svg-inline--fa fa-chevron-up fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg>
                    :
                    <svg onClick={() => setIsComponentVisible(true)} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" className="svg-inline--fa fa-chevron-down fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>
                }
            </div>
            <div ref={ref} className={isComponentVisible ? "dropdown visible" : "dropdown" }>
                    <div className="dropdown__container__list">
                            {props.departments.map(el => {
                                return <div key={Math.random()} className="dropdown__container__list__item" onClick={() => { setChoice(el); setIsComponentVisible(false)}}>{el}</div>
                        })}
                    </div>
            </div>
        </div>
    );
}

export default Dropdown;