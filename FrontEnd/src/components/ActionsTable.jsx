import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";


const ActionsTable = (props) => {

    return (
        <>
            
            <Tooltip arrow={true} placement="top" title="Deletar" animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
                }}>
                <button style={{width: '29px', height: '29px'}} data-tooltip-target="tooltip-default" onClick={props.delete} type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    <FaTrashAlt></FaTrashAlt>
                    <span className="sr-only">Icon description</span>
                </button>
            </Tooltip>

            <Tooltip arrow={true} placement="top" title="Editar" animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
                }}>
                <Link style={{width: '29px', height: '29px'}} to={props.update} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <BsPencilSquare></BsPencilSquare>
                    <span className="sr-only">Icon description</span>
                </Link>
            </Tooltip>


    
            
        </>
    )

}

export default ActionsTable