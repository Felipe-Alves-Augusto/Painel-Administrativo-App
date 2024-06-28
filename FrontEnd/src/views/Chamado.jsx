import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../context/AppContext'
import { FaTrashAlt } from "react-icons/fa";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import { Tooltip } from "@mui/material";
import { FaCheck } from "react-icons/fa";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import Loading from '../components/Loading';
import { MdGridView } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";

const Chamado = () => {

    const { dataCompany, loading, documents, userData } = useContext(AppContext);

    const [modalCalled, setModalCalled] = useState(false);
    const [selectedMachineIndex, setSelectedMachineIndex] = useState(null);
    const [selectedCalledIndex, setSelectedCalledIndex] = useState(null);
    const [hasCalled, setHasCalled] = useState(false);


    useEffect(() => {
        const anyCalled = documents.some(doc => doc.data.machines.some(machine => machine.chamados && machine.chamados.length > 0));
        setHasCalled(anyCalled);
    }, [documents]);

    const handleViewCalled = (machineIndex, chamadoIndex) => {

        setModalCalled(true);
        setSelectedMachineIndex(machineIndex);
        setSelectedCalledIndex(chamadoIndex);

    }



    const handleCloseModal = () => {
        setModalCalled(false);
    }


    const handleClickChamadoAdm = async (docId, chamadoIndexClick) => {
        if (userData && userData.type_user == 'adm') {
            const docRef = doc(firestore, 'empresa', docId);

            const docSnapshot = await getDoc(docRef);

            try {
                if (docSnapshot.exists()) {
                    const companyData = docSnapshot.data();
                    const machines = companyData.machines || [];

                    const updatedMachines = machines.map(machine => {
                        if (machine.chamados) {
                            const updatedChamados = machine.chamados.map((chamado, chamadoIndex) => {
                                if (chamadoIndex === chamadoIndexClick) {

                                    const confirmChamado = window.confirm('Você tem certeza que deseja concluir o chamado?');
                                    const getFullDay = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;

                                    if (confirmChamado) {
                                        return { ...chamado, fechado: getFullDay, status: 'fechado' };
                                    }
                                }
                                return chamado;
                            });
                            return { ...machine, chamados: updatedChamados };
                        }
                        return machine;
                    });

                    await updateDoc(docRef, {
                        machines: updatedMachines
                    });

                    console.log('Alterado com sucesso');
                    window.location.reload();
                } else {
                    console.log('Documento não encontrado');
                }
            } catch (error) {
                console.error('Erro ao atualizar o documento:', error);
            }

        }
    };



    const handleClickChamado = async (chamadoIndexClick) => {
        if (userData && userData.type_user != 'adm') {
            const docRef = doc(firestore, 'empresa', dataCompany.id);

            try {
                if (dataCompany.data) {
                    const machines = dataCompany.data.machines || [];

                    const updatedMachines = machines.map(machine => {
                        if (machine.chamados) {
                            const updatedChamados = machine.chamados.map((chamado, chamadoIndex) => {
                                if (chamadoIndex === chamadoIndexClick) {

                                    const confirmChamado = window.confirm('Você tem certeza que deseja concluir o chamado?');
                                    const getFullDay = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;

                                    if (confirmChamado) {
                                        return { ...chamado, fechado: getFullDay, status: 'fechado' };
                                    }
                                }
                                return chamado;
                            });
                            return { ...machine, chamados: updatedChamados };
                        }
                        return machine;
                    });

                    await updateDoc(docRef, {
                        machines: updatedMachines
                    });

                    console.log('Alterado com sucesso');
                    window.location.reload();
                } else {
                    console.log('Documento não encontrado');
                }
            } catch (error) {
                console.error('Erro ao atualizar o documento:', error);
            }

        }
    };




    // Função para renderizar os detalhes do chamado com base nos índices selecionados
    const renderCalled = () => {
        // if(userData && userData.type_user )
        // Certifique-se de que 'documents' não é nulo ou indefinido
        if (!documents || !Array.isArray(documents)) {
            console.error('Os documentos não estão definidos ou não são um array.');
            return null;
        }

        // Certifique-se de que 'data' está presente em cada documento
        const selectedDocument = documents.find(doc => doc.data && Array.isArray(doc.data.machines));
        console.log('selected document', selectedDocument);
        if (!selectedDocument) {
            console.error('Não foi possível encontrar um documento válido com máquinas.');
            return null;
        }

        // Pegue as máquinas do documento selecionado
        const machines = selectedDocument.data.machines || [];

        // Verifique se os índices são válidos
        if (selectedMachineIndex !== null && selectedMachineIndex < machines.length) {
            const machine = machines[selectedMachineIndex];

            if (machine && Array.isArray(machine.chamados) && selectedCalledIndex !== null && selectedCalledIndex < machine.chamados.length) {
                const chamado = machine.chamados[selectedCalledIndex];

                return (
                    <>
                        <div className='line-details-called'>
                            <b>Cliente: </b> {chamado.client || 'N/A'}
                        </div>
                        <div className='line-details-called'>
                            <b>Número de Série Máquina: </b> {chamado.numberSerie || 'N/A'}
                        </div>
                        <div className='line-details-called'>
                            <b>Máquina: </b> {chamado.modelMchine || 'N/A'}
                        </div>
                        <div className='line-details-called'>
                            <b>Endereço de Instalação: </b> {chamado.addressInstalation || 'N/A'}
                        </div>
                        <div className='line-details-called'>
                            <b>Data de Abertura: </b> {chamado.aberto || 'N/A'}
                        </div>
                        <div className='line-details-called'>
                            <b>Data de Fechamento: </b> {chamado.fechado || 'N/A'}
                        </div>
                        <div className='line-details-called'>
                            <b>Status: </b> {chamado.status || 'N/A'}
                        </div>
                        <div className='line-details-called'>
                            <b>Descrição do Chamado: </b> {chamado.description || 'N/A'}
                        </div>
                    </>
                );
            } else {
                console.error('Chamado ou índice de chamado inválido.');
                return null;
            }
        } else {
            console.error('Índice de máquina inválido ou não há máquinas disponíveis.');
            return null;
        }
    };




    return (
        <>

            {modalCalled &&
                <div className="modal-called">
                    <div className="wrapper-modal">
                        <div className="title-modal">
                            <p>Detalhes do Chamado</p>
                            <button onClick={handleCloseModal} type="button"><IoMdClose></IoMdClose></button>
                        </div>
                        <div className="modal-flex">
                            {renderCalled()}

                        </div>

                    </div>

                </div>
            }

            <Menu></Menu>
            <div className="wrapper-page">
                <Header></Header>
                <TitlePage title="Meus chamados"></TitlePage>

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
                                                <div className='link-chamado'>

                                                    <a href="/maquinas">acesse as máquinas para cadastrar chamados</a>
                                                    <FaLongArrowAltRight />
                                                </div>
                                                <div className="table-info">


                                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                <tr>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Nome do Cliente
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Máquina
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Status
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Abertura
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Fechamento
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Ações
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {hasCalled ? (
                                                                    documents.map((doc, docIndex) => (
                                                                        doc.data.machines.map((machine, machineIndex) => (
                                                                            machine.chamados && machine.chamados.length > 0
                                                                            && machine.chamados.map((chamado, chamadoIndex) => (
                                                                                <tr key={`${machineIndex}-${chamadoIndex}`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                                    <td className="px-6 py-4">{chamado.client}</td>

                                                                                    <td className="px-6 py-4">{chamado.modelMchine}</td>
                                                                                    <td className="px-6 py-4">{chamado.status}</td>
                                                                                    <td className="px-6 py-4">{chamado.aberto}</td>
                                                                                    <td className="px-6 py-4">{chamado.fechado}</td>
                                                                                    <td className="px-6 py-4">

                                                                                        <Tooltip arrow={true} placement="top" title="Concluir chamado" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <button onClick={() => handleClickChamadoAdm(doc.id, chamadoIndex)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                                                                                <FaCheck></FaCheck>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </button>
                                                                                        </Tooltip>
                                                                                        <Tooltip arrow={true} placement="top" title="Detalhes Chamado" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <button onClick={() => handleViewCalled(machineIndex, chamadoIndex)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                                                                <MdGridView></MdGridView>
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
                                    <h2 className="title-table">Cadastre uma empresa para criar chamados</h2>
                                }


                            </>
                        }

                        {userData && userData.type_user != 'adm' &&

                            <>
                                {dataCompany.data ?

                                    <>

                                        {dataCompany.data.machines.length ?
                                            <>
                                                <div className='link-chamado'>

                                                    <a href="/maquinas">acesse as máquinas para cadastrar chamados</a>
                                                    <FaLongArrowAltRight />
                                                </div>
                                                <div className="table-info">


                                                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                                <tr>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Nome do Cliente
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Máquina
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Status
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Abertura
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-3">
                                                                        Fechamento
                                                                    </th>

                                                                    <th scope="col" className="px-6 py-3">
                                                                        Ações
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {dataCompany.data.machines.map((machine, machineIndex) => (

                                                                    <React.Fragment key={machineIndex}>
                                                                        {machine.chamados && machine.chamados.length > 0 ? (
                                                                            machine.chamados.map((chamado, chamadoIndex) => (
                                                                                <tr key={`${machineIndex}-${chamadoIndex}`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                                                    <td className="px-6 py-4">{chamado.client}</td>

                                                                                    <td className="px-6 py-4">{chamado.modelMchine}</td>
                                                                                    <td className="px-6 py-4">{chamado.status}</td>
                                                                                    <td className="px-6 py-4">{chamado.aberto}</td>
                                                                                    <td className="px-6 py-4">{chamado.fechado}</td>
                                                                                    <td className="px-6 py-4">

                                                                                        <Tooltip arrow={true} placement="top" title="Concluir chamado" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <button onClick={() => handleClickChamado(chamadoIndex)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                                                                                <FaCheck></FaCheck>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </button>
                                                                                        </Tooltip>
                                                                                        <Tooltip arrow={true} placement="top" title="Detalhes Chamado" animate={{
                                                                                            mount: { scale: 1, y: 0 },
                                                                                            unmount: { scale: 0, y: 25 },
                                                                                        }}>
                                                                                            <button onClick={() => handleViewCalled(machineIndex, chamadoIndex)} style={{ width: '29px', height: '29px' }} data-tooltip-target="tooltip-default" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                                                                <MdGridView></MdGridView>
                                                                                                <span className="sr-only">Icon description</span>
                                                                                            </button>
                                                                                        </Tooltip>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="7" className="px-6 py-4 text-center">Nenhum chamado cadastrado</td>
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
                                    <h2 className="title-table">Cadastre uma empresa para criar chamados</h2>
                                }
                            </>
                        }

                    </>
                }



            </div>

        </>
    )

}

export default Chamado;