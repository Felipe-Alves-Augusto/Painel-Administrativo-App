import React, { useContext, useState } from "react";
import './Header.css';
import { FaSearch } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { } from "@mui/material"
import AppContext from "../context/AppContext";
import { FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { logout } from "../services/auth";
import { FaAngleUp } from "react-icons/fa6";

const Header = () => {

    const { userData } = useContext(AppContext);

    const [openDrop, setOpenDrop] = useState(false);

    const handleOpenDrop = () => {
        setOpenDrop(true);
    }

    const handleCloseDrop = () => {
        setOpenDrop(false)
    }

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login'
    }

    return (
        <header>
            <div className="welcome">
                {userData &&
                    <h2 className="font-bold">Bem Vindo, {userData.name}</h2>
                }
                
            </div>

            <div className="actions-header">
                {/* <div className="search"> <FaSearch></FaSearch> </div>
                <div className="notication"> <IoMdNotifications></IoMdNotifications> </div> */}
                <button onClick={handleOpenDrop} id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName" className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white" type="button">
                    <span className="sr-only">Open user menu</span>
                    <FaUserCircle className="icon-user" />

                    <svg className="w-2.5 h-2.5 ms-2
                    " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>
                {openDrop &&
                    <div id="dropdownAvatarName" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                     
                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <div onClick={handleCloseDrop} className="close-drop">
                                <IoIosClose />
                            </div>
                            <div className="font-medium ">{userData.name}</div>
                            <div className="truncate">{userData.email}</div>
                            {userData.type_user == 'client' &&
                                <div className="truncate">Cliente</div>
                            }


                            {userData.type_user == 'consierge' &&
                                <div className="truncate">Consierge</div>
                            }

                        </div>


                        <div class="py-2 wrapper-logout">
                            <button onClick={handleLogout} type="button">
                                <IoMdLogOut />
                                <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sair</p>
                            </button>
                        </div>
                    </div>
                }

            </div>
        </header>
    )
}


export default Header