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
import { FaKey } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";


const Machines = () => {

    const { dataCompany, userData, documents, loading, machinesPermission, setLoading } = useContext(AppContext);


    const [hasEmployees, setHasEmployees] = useState(false);


    // Verifica se existe pelo menos uma maquina em qualquer empresa
    useEffect(() => {
        const anyEmployees = documents.some(doc => doc.data.machines && doc.data.machines.length > 0);
        setHasEmployees(anyEmployees);

    }, [documents]);

    console.log('maquinas permitidas', machinesPermission.length)




    const removeElementIndexAdm = async (docId, index) => {
        if (userData && userData.type_user == 'adm') {
            const docRef = doc(firestore, 'empresa', docId);

            const docSnapshot = await getDoc(docRef);

            try {
                if (docSnapshot.exists()) {
                    const companyData = docSnapshot.data();
                    const machinesArr = companyData.machines || [];
                    if (Array.isArray(machinesArr) && index >= 0 && machinesArr) {
                        machinesArr.splice(index, 1); // Remove o elemento no índice especificado

                        await updateDoc(docRef, {
                            machines: machinesArr
                        })

                        console.log('maquina removida com sucesso');
                        window.location.reload();

                    } else {
                        console.error("Índice inválido ou o campo não é um array.");
                    }
                }
            } catch (error) {
                console.error(error);
            }

        }
    }


    const handleRemoveAdm = async (docId, index) => {

        const indexInt = parseInt(index, 10);
        if (docId && !isNaN(indexInt)) {


            const confirmDelete = window.confirm('Você tem certeza que deseja excluir?');
            if (confirmDelete) {
                await removeElementIndexAdm(docId, indexInt)
            }

        } else {
            console.log('indice é necessário!');
        }


    }

    const removeElementIndex = async (docId, index) => {
        if (userData && userData.type_user != 'adm') {
            const docRef = doc(firestore, 'empresa', docId);

            try {
                if (dataCompany && dataCompany.data && dataCompany.data.machines) {
                    const machinesArr = dataCompany.data.machines
                    if (Array.isArray(machinesArr) && index >= 0 && machinesArr) {
                        machinesArr.splice(index, 1); // Remove o elemento no índice especificado

                        await updateDoc(docRef, {
                            machines: machinesArr
                        })

                        console.log('maquina removida com sucesso');
                        window.location.reload();

                    } else {
                        console.error("Índice inválido ou o campo não é um array.");
                    }
                }
            } catch (error) {
                console.error(error);
            }

        }
    }


    const handleRemove = async (index) => {

        const indexInt = parseInt(index, 10);
        if (dataCompany.id && !isNaN(indexInt)) {


            const confirmDelete = window.confirm('Você tem certeza que deseja excluir?');
            if (confirmDelete) {
                await removeElementIndex(dataCompany.id, indexInt)
            }

        } else {
            console.log('indice é necessário!');
        }


    }

    const headers = [
        { label: "Quantidades de Produtos por Bandeja", key: "amountProductTray" },
        { label: "Quantidades de Bandejas", key: "amountTray" },
        { label: "Descrição", key: "description" },
        { label: "id", key: "id" },
        { label: "Modelo da Máquina", key: "modelMachine" },
        { label: "Número de Série", key: "numberSerie" },
        { label: "Status", key: "status" },


    ];

    //const targetRef = useRef();
    const reportMachines = dataCompany.data ? dataCompany.data.machines : [];

    return (
        <>
            <Menu></Menu>
            <div className="wrapper-page">
                <Header></Header>

                <TitlePage title="Minhas Máquinas"></TitlePage>





                {loading ?
                    <Loading></Loading>

                    :
                    <>
                        {userData && userData.type_user == 'adm' &&
                            <>
                                {documents ?

                                    <>



                                        <div className="wrapper-buttons">
                                            <ButtonCreate text="Cadastrar" link="/maquinas/cadastro"></ButtonCreate>

                                            <ButtonCsv filename="maquinas" report={reportMachines} headers={headers}></ButtonCsv>

                                            <a href='/chamado/cadastro' className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800"><FaPlus></FaPlus> Abrir chamado</a>



                                        </div>





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
                                                                        Quantidade de produtos por bandeja
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

                                                                                        <td scope="row" className="px-2 py-4">
                                                                                            {doc.data.nameCompany}
                                                                                        </td>
                                                                                        <td scope="row" className="px-2 py-4">
                                                                                            {machine.modelMachine}
                                                                                        </td>
                                                                                        <td className="px-2 py-4">
                                                                                            {machine.numberSerie}
                                                                                        </td>
                                                                                        <td className="px-2 py-4">
                                                                                            {machine.amountTray}
                                                                                        </td>
                                                                                        <td className="px-2 py-4">
                                                                                            {machine.amountProductTray}
                                                                                        </td>
                                                                                        <td className="px-2 py-4 actions-table">

                                                                                            <Tooltip arrow={true} placement="top" title="Permissões de Máquina" animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 } }}>
                                                                                                <a href={`/permissoes-maquina/${machine.id}/${doc.id}`} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
                                                                                                    <FaKey />
                                                                                                    <span className="sr-only">Icon description</span>
                                                                                                </a>
                                                                                            </Tooltip>




                                                                                            <Tooltip arrow={true} placement="top" title="Adicionar Locação" animate={{
                                                                                                mount: { scale: 1, y: 0 },
                                                                                                unmount: { scale: 0, y: 25 },
                                                                                            }}>
                                                                                                <a href={`/locacao/cadastro/${machine.id}`} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" className="text-white bg-sky-400 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">
                                                                                                    <FaLocationDot ></FaLocationDot >
                                                                                                    <span className="sr-only">Icon description</span>
                                                                                                </a>
                                                                                            </Tooltip>






                                                                                            {/* <Tooltip arrow={true} placement="top" title="Abrir Chamado" animate={{
                                                                                                mount: { scale: 1, y: 0 },
                                                                                                unmount: { scale: 0, y: 25 },
                                                                                            }}>
                                                                                                <a href={`/chamado/cadastro/${machine.id}/${doc.id}`} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
                                                                                                    <GiAutoRepair></GiAutoRepair>
                                                                                                    <span className="sr-only">Icon description</span>
                                                                                                </a>
                                                                                            </Tooltip> */}

                                                                                            <Tooltip arrow={true} placement="top" title="Deletar" animate={{
                                                                                                mount: { scale: 1, y: 0 },
                                                                                                unmount: { scale: 0, y: 25 },
                                                                                            }}>
                                                                                                <button style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" onClick={() => handleRemoveAdm(doc.id, machineIndex)} type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                                                                    <FaTrashAlt></FaTrashAlt>
                                                                                                    <span className="sr-only">Icon description</span>
                                                                                                </button>
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

                                        {machinesPermission.length ?
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
                                                                {machinesPermission && (
                                                                    <>
                                                                        {machinesPermission.map((machine, index) =>
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



                                                                                        {/* <Tooltip arrow={true} placement="top" title="Deletar" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <button style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" onClick={() => handleRemove(index)} type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                                                                <FaTrashAlt></FaTrashAlt>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </button>
                                                                                        </Tooltip> */}
                                                                                        {/* {userData && userData.type_user == "adm" &&
                                                                                            <Tooltip arrow={true} placement="top" title="Adicionar Locação" animate={{
                                                                                                mount: { scale: 1, y: 0 },
                                                                                                unmount: { scale: 0, y: 25 },
                                                                                            }}>
                                                                                                <a href={`/locacao/cadastro/${machine.id}`} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" className="text-white bg-sky-400 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">
                                                                                                    <FaLocationDot ></FaLocationDot >
                                                                                                    <span className="sr-only">Icon description</span>
                                                                                                </a>
                                                                                            </Tooltip>
                                                                                        } */}




                                                                                        <Tooltip arrow={true} placement="top" title="Abrir Chamado" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <a href={`/chamado/cadastro/${machine.id}/${dataCompany.id}`} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
                                                                                                <GiAutoRepair></GiAutoRepair>
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


export default Machines
