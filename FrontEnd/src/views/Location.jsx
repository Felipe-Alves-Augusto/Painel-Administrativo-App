import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../context/AppContext'
import { FaTrashAlt } from "react-icons/fa";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import { Tooltip } from "@mui/material";
import Loading from '../components/Loading';
import { BsPencilSquare } from "react-icons/bs";
import { firestore } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { MdGridView } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const Location = () => {

    const { dataCompany, loading, documents, userData } = useContext(AppContext);
    const [modalLocation, setModalLocation] = useState(false);
    const [selectedMachineIndex, setSelectedMachineIndex] = useState(null);
    const [selectedLocationIndex, setSelectedLocationIndex] = useState(null);
    const [hasEmployees, setHasEmployees] = useState(false);
    const [hasLocations, setHasLocations] = useState(false);
    const [docId, setDocId] = useState('');
    const [locationDetails, setLocationDetails] = useState([])

    console.log('docid', docId)

    // Verifica se existe pelo menos um funcionário em qualquer empresa
    useEffect(() => {
        const anyEmployees = documents.some(doc => doc.data.machines && doc.data.machines.length > 0);
        setHasEmployees(anyEmployees);
    }, [documents]);

    useEffect(() => {
        const anyLocation = documents.some(doc => doc.data.machines.some(machine => machine.location && machine.location.length > 0));
        setHasLocations(anyLocation);
    }, [documents]);

    const handleViewCalled = (docId, machineIndex, locationIndex) => {

        setModalLocation(true);
        setSelectedMachineIndex(machineIndex);
        setSelectedLocationIndex(locationIndex)
        setDocId(docId);

    }



    const handleCloseModal = () => {
        setModalLocation(false);
    }


    const removeElementIndex = async (docId, machineIndex, locationIndex) => {
        const docRef = doc(firestore, 'empresa', docId);

        try {

            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const companyData = docSnapshot.data();
                const machinesArr = companyData.machines || [];

                if (Array.isArray(machinesArr) && machinesArr[machineIndex]) {
                    const locationArr = machinesArr[machineIndex].location;

                    if (Array.isArray(locationArr) && locationIndex >= 0 && locationIndex < locationArr.length) {
                        locationArr.splice(locationIndex, 1); // Remove o elemento no índice especificado

                        // Atualize o array machines com a bandeja modificada
                        machinesArr[machineIndex].location = locationArr;

                        // Atualize o documento no Firestore
                        updateDoc(docRef, {
                            machines: machinesArr
                        });

                        console.log('Localização removida com sucesso!');

                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    } else {
                        console.error("Índice inválido ou o campo não é um array.");
                    }
                } else {
                    console.error("Índice de máquina inválido ou o campo não é um array.");
                }
            } else {
                console.log('empresa não encontrada')
            }
        } catch (error) {
            console.error(error);
        }
    }



    const handleRemove = (docId, machineIndex, locationIndex) => {
        const machineIndexInt = parseInt(machineIndex, 10);
        const locationIndexInt = parseInt(locationIndex, 10);

        if (dataCompany.id && !isNaN(machineIndexInt) && !isNaN(locationIndexInt)) {
            const confirmDelete = window.confirm('Você tem certeza que deseja excluir?');
            if (confirmDelete) {
                removeElementIndex(docId, machineIndexInt, locationIndexInt);
            }
        } else {
            console.log('Índices são necessários!');
        }
    };





    useEffect(() => {
        const fetchLocation = async () => {
            try {
                if (!docId || selectedMachineIndex === null || selectedLocationIndex === null) {
                    throw new Error('Parâmetros inválidos');
                }

                const docRef = doc(firestore, 'empresa', docId);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const companyData = docSnapshot.data();
                    const machines = companyData?.machines || [];

                    if (selectedMachineIndex >= 0 && selectedMachineIndex < machines.length) {
                        const machine = machines[selectedMachineIndex];
                        const locations = machine?.location || [];

                        if (selectedLocationIndex >= 0 && selectedLocationIndex < locations.length) {
                            const location = locations[selectedLocationIndex];
                            setLocationDetails(location);
                        } else {
                            throw new Error('Índice de localização inválido');
                        }
                    } else {
                        throw new Error('Índice de máquina inválido');
                    }
                } else {
                    throw new Error('Documento não encontrado');
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchLocation();
    }, [docId, selectedMachineIndex, selectedLocationIndex, firestore]);


    return (
        <>

            {modalLocation &&
                <div className="modal-called">
                    <div className="wrapper-modal">
                        <div className="title-modal">
                            <p>Detalhes da Locação</p>
                            <button onClick={handleCloseModal} type="button"><IoMdClose></IoMdClose></button>
                        </div>
                        <div className="modal-flex">

                            {locationDetails != null &&
                                <>
                                    <div className='line-details-called'>
                                        <b>Cliente: </b> {locationDetails.clientName}
                                    </div>
                                    <div className='line-details-called'>
                                        <b>Localização: </b> {locationDetails.location}
                                    </div>
                                    <div className='line-details-called'>
                                        <b>Máquina: </b> {locationDetails.nameMachine}
                                    </div>
                                    <div className='line-details-called'>
                                        <b>Status da Máquina: </b> {locationDetails.status}
                                    </div>
                                    <div className='line-details-called'>
                                        <b>Número de Série Máquina: </b> {locationDetails.numberMachine}
                                    </div>

                                    <div className='line-details-called'>
                                        <b>Tipo de Venda: </b> {locationDetails.typeSale}
                                    </div>
                                </>
                            }

                        </div>

                    </div>

                </div>
            }
            <Menu></Menu>
            <div className="wrapper-page">
                <Header></Header>
                <TitlePage title="Minhas Locações"></TitlePage>


                {loading ?
                    <Loading></Loading>

                    :

                    <>
                        {userData && userData.type_user == 'adm' &&
                            <>
                                {documents ?

                                    <>

                                        {hasEmployees ?
                                            <>
                                                <div className="table-info">


                                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                <tr>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Nome do Cliente
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Nome da Máquina
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Número de Série Máquina
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Tipo de Venda
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Ações
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {hasLocations ? (
                                                                    documents.map((doc, docIndex) => (
                                                                        doc.data.machines.map((machine, machineIndex) => (
                                                                            machine.location && machine.location.length > 0
                                                                            && machine.location.map((location, locationIndex) => (
                                                                                <tr key={`${machineIndex}`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                                    <td className="px-6 py-4">{location.clientName}</td>
                                                                                    <td className="px-6 py-4">{location.nameMachine}</td>
                                                                                    <td className="px-6 py-4">{location.numberMachine}</td>
                                                                                    <td className="px-6 py-4">{location.typeSale}</td>
                                                                                    <td className="px-6 py-4">

                                                                                        <Tooltip arrow={true} placement="top" title="Editar" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <a href={`/locacao/editar/${location.idLocation}/${doc.id}`} style={{ width: '29px', height: '29px' }} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                                                                <BsPencilSquare></BsPencilSquare>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </a>
                                                                                        </Tooltip>
                                                                                        <Tooltip arrow={true} placement="top" title="Detalhes da Locação/Venda" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <button onClick={() => handleViewCalled(doc.id, machineIndex, locationIndex)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
                                                                                                <MdGridView></MdGridView>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </button>
                                                                                        </Tooltip>
                                                                                        <Tooltip arrow={true} placement="top" title="Deletar" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <button onClick={() => handleRemove(doc.id, machineIndex, locationIndex)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                                                                <FaTrashAlt></FaTrashAlt>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </button>
                                                                                        </Tooltip>


                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ))
                                                                    ))
                                                                ) : (
                                                                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                                            Nenhuma localização disponível
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
                                    <h2 className="title-table">Cadastre uma empresa para criar locações</h2>
                                }
                            </>
                        }

                        {userData && userData.type_user !== 'adm' &&
                            <>
                                {dataCompany.data ?

                                    <>

                                        {dataCompany.data.machines.length ?
                                            <>
                                                <div className="table-info teste">


                                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                <tr>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Nome do Cliente
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Nome da Máquina
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Número de Série Máquina
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Tipo de Venda
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Ações
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {dataCompany.data && dataCompany.data.machines.map((machine, machineIndex) => (
                                                                    <React.Fragment key={machineIndex}>
                                                                        {machine.location && machine.location.length > 0 ? (
                                                                            machine.location.map((location, locationIndex) => (
                                                                                <tr key={`${machineIndex}-${locationIndex}`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                                    <td className="px-6 py-4">{location.clientName}</td>
                                                                                    <td className="px-6 py-4">{location.nameMachine}</td>
                                                                                    <td className="px-6 py-4">{location.numberMachine}</td>
                                                                                    <td className="px-6 py-4">{location.typeSale}</td>
                                                                                    <td className="px-6 py-4">

                                                                                        {/* <Tooltip arrow={true} placement="top" title="Editar" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <a href={`/locacao/editar/${location.idLocation}`} style={{ width: '29px', height: '29px' }} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                                                                <BsPencilSquare></BsPencilSquare>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </a>
                                                                                        </Tooltip> */}
                                                                                        <Tooltip arrow={true} placement="top" title="Detalhes da Locação/Venda" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <button onClick={() => handleViewCalled(dataCompany.id, machineIndex, locationIndex)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
                                                                                                <MdGridView></MdGridView>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </button>
                                                                                        </Tooltip>
                                                                                        {/* <Tooltip arrow={true} placement="top" title="Deletar" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <button onClick={() => handleRemove(machineIndex, locationIndex)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                                                                <FaTrashAlt></FaTrashAlt>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </button>
                                                                                        </Tooltip> */}


                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="5" className="px-6 py-4 text-center">Nenhuma localização cadastrada</td>
                                                                            </tr>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}


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
                                    <h2 className="title-table">Cadastre uma empresa para criar locações</h2>
                                }
                            </>
                        }

                    </>
                }



            </div>

        </>
    )

}

export default Location;