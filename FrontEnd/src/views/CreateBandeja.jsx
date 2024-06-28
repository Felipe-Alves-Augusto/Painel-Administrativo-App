import React, { useContext, useState } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import Message from "../components/Message";
import Input from "../components/Input";
import AppContext from "../context/AppContext";
import { firestore } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { v4 } from 'uuid'


const CreateBandeja = () => {

    const { dataCompany, setShowMessage, documents, setShowMessageError } = useContext(AppContext);


    const [bandeja, setBandeja] = useState('');
    const [machineDocSelect, setDocMachine] = useState('');
    const [nameMachine, setNameMachine] = useState('');
    const [machineId, setMachineId] = useState('');


    const uniqueId = v4()
    const idGenerator = uniqueId.slice(0, 8);

    const handleBandeja = (e) => {
        setBandeja(e.target.value);
    }

    const handleSelect = (e) => {
        let select = document.getElementById('machines');

        setDocMachine(e.target.value);
        let optionSelected = e.target.children[select.selectedIndex].textContent;
        let idMachineSelected = e.target.children[select.selectedIndex].getAttribute('idmachine');
        setNameMachine(optionSelected);
        setMachineId(idMachineSelected)
    }




    const handleInsert = async (bandeja, nameMachine) => {
        try {
            // Refere-se ao documento da empresa com base no ID da empresa selecionada
            const docRef = doc(firestore, 'empresa', machineDocSelect);

            // Obtém o documento da empresa
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                // Obtém os dados da empresa
                const companyData = docSnapshot.data();

                // Obtém as máquinas ou inicializa um array vazio se não existirem
                const machines = companyData.machines || [];

                // Atualiza as máquinas para incluir a nova bandeja na máquina correta
                const updatedMachines = machines.map(machine => {
                    if (machine.id === machineId) { // Certifica-se de que estamos na máquina correta

                        // Verifica se a bandeja já existe na máquina
                        const bandejaExists = machine.bandeja
                            ? machine.bandeja.some(b => b.bandeja === bandeja)
                            : false;

                        if (bandejaExists) {
                            console.log('Bandeja já existe para esta máquina.');
                            // setShowMessageError(true);
                            return machine; // Retorna a máquina sem alterações
                        } else {
                            // Adiciona a nova bandeja ao array de bandejas da máquina
                            const updatedBandeja = machine.bandeja
                                ? [...machine.bandeja, { bandeja, nameMachine, idBandeja: idGenerator, products: [] }]
                                : [{ bandeja, nameMachine, idBandeja: idGenerator, products: [] }];

                            return {
                                ...machine,
                                bandeja: updatedBandeja
                            };
                        }
                    } else {
                        // Retorna a máquina inalterada
                        return machine;
                    }
                });

                // Atualiza o documento no Firestore com as alterações
                await updateDoc(docRef, {
                    machines: updatedMachines
                });

                console.log('Registrado com sucesso');

                // Limpa os campos
                setBandeja('');
                setDocMachine('');
                setShowMessage(true);

                // Redireciona após 3 segundos
                setTimeout(() => {
                    window.location.href = '/bandejas';
                }, 2000);
            } else {
                console.log('Documento da empresa não encontrado');
            }
        } catch (error) {
            console.error('Erro ao registrar bandeja:', error);
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleInsert(bandeja, nameMachine);
    }

    return (
        <>
            <Menu></Menu>

            <div className="wrapper-page">
                <Header></Header>
                <TitlePage title="Cadastro de Bandeja"></TitlePage>
                <Message text="Bandeja criada com sucesso!" textError="Bandeja já existe para esta máquina."></Message>
                <div className="form-create">
                    <form onSubmit={handleSubmit} method="post">
                        <div className="form-group form-select mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total de Bandeja</label>
                            <select required onChange={handleBandeja} value={bandeja} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected> Selecione uma opção</option>
                                <option value="bandeja1">Bandeja 1</option>
                                <option value="bandeja2">Bandeja 2</option>
                                <option value="bandeja3">Bandeja 3</option>
                                <option value="bandeja4">Bandeja 4</option>
                                <option value="bandeja5">Bandeja 5</option>
                                <option value="bandeja6">Bandeja 6</option>
                                <option value="bandeja7">Bandeja 7</option>
                                <option value="bandeja8">Bandeja 8</option>
                                <option value="bandeja9">Bandeja 9</option>
                                <option value="bandeja10">Bandeja 10</option>
                                <option value="bandeja11">Bandeja 11</option>
                                <option value="bandeja12">Bandeja 12</option>
                                <option value="bandeja13">Bandeja 13</option>
                                <option value="bandeja14">Bandeja 14</option>
                                <option value="bandeja15">Bandeja 15</option>
                                <option value="bandeja16">Bandeja 16</option>
                            </select>



                        </div>
                        {/* <Input
                            label="Nome da Bandeja"
                            name="bandeja"
                            type="text"
                            change={handleBandeja}
                            value={bandeja}
                        ></Input> */}

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
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Cadastrar</button>
                    </form>
                </div>
            </div>
        </>
    )

}

export default CreateBandeja;