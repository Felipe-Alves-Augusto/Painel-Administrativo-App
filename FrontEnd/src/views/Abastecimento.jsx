import React, { useContext, useState, useEffect } from "react";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import Menu from "../components/Menu";
import AppContext from "../context/AppContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { Tooltip } from "@mui/material";
import { GiAutoRepair } from "react-icons/gi";
import { FaTrashAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import ButtonCsv from "../components/ButtonCsv";
import ButtonCreate from "../components/ButtonCreate";
import Loading from "../components/Loading";
import { GiArchiveRegister } from "react-icons/gi";


const Abastecimento = () => {

    const { dataCompany, userData, documents, loading } = useContext(AppContext);


    const [hasEmployees, setHasEmployees] = useState(false);

    // Verifica se existe pelo menos uma maquina em qualquer empresa
    useEffect(() => {
        const anyEmployees = documents.some(doc => doc.data.machines && doc.data.machines.length > 0);
        setHasEmployees(anyEmployees);
    }, [documents]);












    return (
        <>
            <Menu></Menu>
            <div className="wrapper-page">
                <Header></Header>

                <TitlePage title="Abastecimento de Máquinas"></TitlePage>





                {loading ?
                    <Loading></Loading>

                    :
                    <>
                        {userData && userData.type_user == 'adm' &&
                            <>
                                {documents ?

                                    <>

                                        {documents.length ?
                                            <>
                                                <div className="table-info">


                                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                <tr>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        empresa
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Máquina
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Número de Série
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Quantidade de bandejas
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Ações
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {hasEmployees ? (
                                                                    documents.map((doc, docIndex) => (
                                                                        <React.Fragment key={doc.id}>
                                                                            {doc.data.machines && doc.data.machines.length > 0 ? (
                                                                                doc.data.machines.map((machine, machineIndex) => (
                                                                                    <tr key={machineIndex} className="text-center odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">

                                                                                        <td scope="row" className="px-6 py-4">
                                                                                            {doc.data.nameCompany}
                                                                                        </td>
                                                                                        <td scope="row" className="px-6 py-4">
                                                                                            {machine.modelMachine}
                                                                                        </td>
                                                                                        <td className="px-6 py-4">
                                                                                            {machine.numberSerie}
                                                                                        </td>

                                                                                        {machine.bandeja && machine.bandeja.length > 0 ?
                                                                                            <>
                                                                                                <td className="px-6 py-4">{machine.bandeja.length}</td>
                                                                                            </>
                                                                                            :
                                                                                            <td className="px-6 py-4">0</td>
                                                                                        }



                                                                                        <td className="px-6 py-4 actions-table">




                                                                                            <Tooltip arrow={true} placement="top" title="Abastecer Máquina" animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 } }}>
                                                                                                <a href={`/produtos/${doc.id}`} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                                                                    <GiArchiveRegister />
                                                                                                    <span className="sr-only">Icon description</span>
                                                                                                </a>
                                                                                            </Tooltip>



                                                                                        </td>
                                                                                    </tr>
                                                                                ))
                                                                            ) : null}
                                                                        </React.Fragment>
                                                                    ))
                                                                ) : (
                                                                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                                            Nenhuma máquina cadastrada
                                                                        </td>
                                                                    </tr>
                                                                )}



                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                            </>

                                            :
                                            <h2 className="title-table">Nenhuma máquina cadastrada</h2>
                                        }

                                    </>

                                    :
                                    <h2 className="title-table">Cadastre uma empresa para criar máquinas</h2>
                                }
                            </>
                        }



                        {userData && userData.type_user != 'adm' &&
                            <>
                                {dataCompany.data ?

                                    <>

                                        {dataCompany.data.machines.length ?
                                            <>
                                                <div className="table-info">


                                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                <tr>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Modelo da Máquina
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Número de Série
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Quantidade de bandejas
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Quantidade de produtos por bandeja
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Ações
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {dataCompany && dataCompany.data && dataCompany.data.machines && (
                                                                    <>
                                                                        {dataCompany.data.machines.map((machine, index) =>
                                                                            <>
                                                                                {/* {setIndex(machine.id)} */}
                                                                                <tr key={index} className="text-center odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                                        {machine.modelMachine}
                                                                                    </th>
                                                                                    <td className="px-6 py-4">
                                                                                        {machine.numberSerie}
                                                                                    </td>
                                                                                    <td className="px-6 py-4">
                                                                                        {machine.amountTray}
                                                                                    </td>
                                                                                    <td className="px-6 py-4">
                                                                                        {machine.amountProductTray}
                                                                                    </td>
                                                                                    <td className="px-6 py-4 actions-table">

                                                                                        <Tooltip arrow={true} placement="top" title="Abastecer Máquina" animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 } }}>
                                                                                            <a href={`/produtos/${dataCompany.id}`} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                                                                <GiArchiveRegister />
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </a>
                                                                                        </Tooltip>


                                                                                    </td>
                                                                                </tr>

                                                                            </>

                                                                        )}
                                                                    </>

                                                                )}


                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                            </>

                                            :
                                            <h2 className="title-table">Nenhuma máquina cadastrada</h2>
                                        }

                                    </>

                                    :
                                    <h2 className="title-table">Cadastre uma empresa para criar máquinas</h2>
                                }
                            </>
                        }

                    </>
                }


            </div>

        </>
    );

}


export default Abastecimento
