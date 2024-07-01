import React from 'react';
import './Unauthorized.css'; // Import CSS file for styling

const Unauthorized = ({code,text1,text2,text3,text4,text5,text6,route}) => {
    return (
        <div className="unauthorized-container">
            <h1 className="error-code">{code}</h1>
            <p className="unauthorized-text">{text1} <br /> {text2}</p>
            <p className="unauthorized-text-2">
               {text3}<span className='flex'> {text4}  </span> <span>{text5}<a href={route}>{text6}</a></span>
            </p>
        </div>
    );
};

export default Unauthorized;
