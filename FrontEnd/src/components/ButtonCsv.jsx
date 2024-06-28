import React from "react";
import { BsFileEarmarkSpreadsheetFill } from "react-icons/bs";
import {CSVLink } from 'react-csv';


const ButtonCsv = (props) => {

    return (
        <CSVLink 
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" 
            filename={`relatorios_${props.filename}.csv`} 
            data={props.report} 
            headers={props.headers}>
            <BsFileEarmarkSpreadsheetFill></BsFileEarmarkSpreadsheetFill>
            Exportar em csv
        </CSVLink>
    )

}

export default ButtonCsv