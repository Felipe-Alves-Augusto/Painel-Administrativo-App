import React, { useContext, useState } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import Message from "../components/Message";
import Input from "../components/Input";
import AppContext from "../context/AppContext";
import { firestore } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";


const CreateChamado = () => {

    // campos
    // numero de serie da maquina
    //descrição do chamado

    const { machineId, docCompany } = useParams();
    // console.log(machineId)
    const { dataCompany, setShowMessage, userData, documents } = useContext(AppContext);

    const [description, setDescription] = useState('');
    const [typeDefect, setTypeDefect] = useState('');
    const [addressInstalation, setAddressInstalation] = useState('');
    const [machineDocSelect, setDocMachine] = useState(docCompany);
    // const [nameMachine, setNameMachine] = useState('');
    const [machineIdd, setMachineId] = useState(machineId);

    const handleSelect = (e) => {
        let select = document.getElementById('machines');

        setDocMachine(e.target.value);
        // let optionSelected = e.target.children[select.selectedIndex].textContent;
        let idMachineSelected = e.target.children[select.selectedIndex].getAttribute('idmachine');
        // setNameMachine(optionSelected);
        setMachineId(idMachineSelected)
    }

    const handleTypeDefect = (e) => {
        setTypeDefect(e.target.value);
    }

    const handleDescription = (e) => {
        setDescription(e)
    }

    const handleAddressInstalation = (e) => {

        setAddressInstalation(e);
    }

    const handleInsert = async (description, typeDefect, addressInstalation) => {
        // const docRef = doc(firestore, 'empresa', dataCompany.id);


        const docRef = doc(firestore, 'empresa', machineDocSelect);
        const docSnapshot = await getDoc(docRef);

        try {
            if (docSnapshot.exists()) {

                const companyData = docSnapshot.data();
                const machines = companyData.machines || [];

                // Atualize o array machines para incluir a nova bandeja na máquina correta
                const updatedMachines = machines.map(machine => {
                    if (machine.id === machineIdd) {

                        const getFullDay = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
                        // Adicione o novo item ao array bandeja existente
                        const updatedChamados = machine.chamados ? [...machine.chamados,
                        { description, typeDefect, addressInstalation, client: userData.name, numberSerie: machine.numberSerie, modelMchine: machine.modelMachine, aberto: getFullDay, fechado: '', status: 'aberto' }] : [{ description, typeDefect, addressInstalation, client: userData.name, numberSerie: machine.numberSerie, modelMchine: machine.modelMachine, aberto: getFullDay, fechado: '', status: 'aberto' }];
                        return {
                            ...machine,
                            chamados: updatedChamados
                        };
                    } else {
                        return machine;
                    }
                });

                // Atualize o documento no Firestore com as alterações
                await updateDoc(docRef, {
                    machines: updatedMachines
                });

                console.log('Registrado com sucesso');
                // Limpe os campos
                setDescription('');

                setShowMessage(true);

                // Redirecione após 3 segundos
                setTimeout(() => {
                    window.location.href = '/chamados';
                }, 2000);
            } else {
                console.log('Documento não encontrado');
            }

        } catch (error) {
            console.error(error)
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleInsert(description, typeDefect, addressInstalation);


    }

    return (
        <>
            <Menu></Menu>

            <div className="wrapper-page">
                <Header></Header>
                <TitlePage title="Solicitar Reparo Técnico"></TitlePage>
                <Message text="Chamado aberto com sucesso!"></Message>


                <div className="form-create">
                    <form onSubmit={handleSubmit} method="post">

                        {!docCompany &&
                            <div className="form-group mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Máquinas</label>
                                <select required onChange={handleSelect} value={machineDocSelect} id="machines" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected> Selecione uma opção</option>
                                    {documents && documents.length &&
                                        <>
                                            {documents.map((doc) =>
                                                doc.data.machines.map((machine) =>
                                                    <option idMachine={machine.id} value={machine.companyDoc}>{machine.modelMachine}</option>
                                                )

                                            )}


                                        </>
                                    }

                                </select>



                            </div>
                        }

                        <div className="form-group form-select mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Causa do Chamado</label>
                            <select required onChange={handleTypeDefect} value={typeDefect} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected> Selecione uma opção</option>
                                <option value='nao liga'>Não Liga</option>
                                <option value='nao acessa a internet'>Não Acessa a Internet</option>
                                <option value='tela quebrada'>Tela Quebrada </option>
                                <option value='tela quebrada'>Botões Ruins</option>
                                <option value='lcd quebrado'>LCD Quebrado</option>
                                <option value='limpeza interna'>Limpeza Interna</option>
                                <option value='limpeza externa'>Limpeza Externa</option>
                                <option value='troca de equipamento'>Troca de Equipamento</option>
                                <option value='cabo de forca ruim'>Cabo de Força Ruim</option>
                            </select>



                        </div>
                        <Input
                            label="Descrição do Chamado"
                            name="chamado"
                            type="text"
                            value={description}
                            change={handleDescription}

                        ></Input>

                        <Input
                            label="Endereço de Instalação"
                            name="addressInstalation"
                            type="text"
                            value={addressInstalation}
                            change={handleAddressInstalation}

                        ></Input>




                        <div className="wrapper-button-form">
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Solicitar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )

}

export default CreateChamado;