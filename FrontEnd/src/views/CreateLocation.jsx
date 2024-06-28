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
import { v4 } from 'uuid'
import Loading from "../components/Loading";

const CreateLocation = () => {

    const { dataCompany, setShowMessage, loading, documents } = useContext(AppContext);

    const { machineId } = useParams()

    const [location, setLocation] = useState('');
    const [clientName, setClientName] = useState('');
    const [typeSale, setTypeSale] = useState('');
    const [selectCompany, setSelectCompany] = useState('');

    console.log('selectd', selectCompany)

    const handleSelectCompany = (e) => {

        setSelectCompany(e.target.value);
        let select = document.getElementById('company');
        
        
        let optionSelected = e.target.children[select.selectedIndex].textContent
        console.log('nome', optionSelected);
        setClientName(optionSelected);
    }

    const uniqueId = v4()
    const idGenerator = uniqueId.slice(0, 8);

    const handleTypeSale = (e) => {
        setTypeSale(e.target.value)
    }


    const handleLocation = (e) => {
        setLocation(e.target.value);
    }





    const handleInsert = async (location, clientName, typeSale) => {
        const docRef = doc(firestore, 'empresa', selectCompany);

        try {
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                // Obtém os dados da empresa
                const companyData = docSnapshot.data();

                // Obtém as máquinas ou inicializa um array vazio se não existirem
                const machines = companyData.machines || [];
                // Atualize o array machines para incluir a nova bandeja na máquina correta
                const updatedMachines = machines.map(machine => {
                    if (machine.id === machineId) {

                        // Adicione o novo item ao array bandeja existente
                        const updatedLocation = machine.location ? [...machine.location, { idLocation: idGenerator, location, clientName, typeSale, nameMachine: machine.modelMachine, numberMachine: machine.numberSerie, status: machine.status }] : [{ idLocation: idGenerator, location, clientName, typeSale, nameMachine: machine.modelMachine, numberMachine: machine.numberSerie, status: machine.status }];
                        return {
                            ...machine,
                            location: updatedLocation
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
                setClientName('');
                setLocation('');
                setTypeSale('');
                setShowMessage(true);


                // Redirecione após 3 segundos
                setTimeout(() => {
                    window.location.href = '/locacao';
                }, 2000);

            } else {

                console.log('empresa não encontrada');
            }


        } catch (error) {
            console.error(error)
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleInsert(location, clientName, typeSale);
    }

    return (
        <>

            <Menu></Menu>

            <div className="wrapper-page">
                <Header></Header>
                <TitlePage title="Cadasto Vendas ou Locações"></TitlePage>
                <Message text="Locação criada com sucesso"></Message>

                {loading ?

                    <Loading></Loading>
                    :
                    <div className="form-create">
                        <form onSubmit={handleSubmit} method="post">
                            <div className="form-group form-select mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome do Cliente</label>
                                <select id="company" required onChange={handleSelectCompany} value={selectCompany} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected> Selecione uma opção</option>
                                    {documents && documents.length ?
                                        <>
                                            {documents.map((company) =>

                                                <option value={company.id}>{company.data.nameCompany}</option>
                                            )}
                                        </>
                                        :
                                        <option value=''>Nehum empresa cadastrada</option>
                                    }

                                </select>



                            </div>
                            <div className="form-group form-select mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Locação/Venda</label>
                                <select required onChange={handleTypeSale} value={typeSale} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected> Selecione uma opção</option>
                                    <option value='venda'>Venda</option>
                                    <option value='locacao'>Locação</option>
                                </select>



                            </div>
                            <div className="form-group mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Endereço de Locação</label>
                                <textarea rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={location} onChange={handleLocation} name="location">

                                </textarea>
                            </div>

                            <div className="wrapper-button-form">
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Cadastrar</button>
                            </div>
                        </form>
                    </div>
                }

            </div>
        </>
    )
}

export default CreateLocation