import React from "react";
import InputMask from 'react-input-mask'


const Input = (props) => {

    return (
        <div className="form-group mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{props.label}</label>
            <InputMask
                onChange={(e) => props.change(e.target.value)}
                value={props.value}
                type={props.type}
                name={props.name}
                placeholder={props.placeholder}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
                mask={props.mask}
                maskPlaceholder={null}
                
                >
            </InputMask>
            
            
        </div >
    )

}


export default Input