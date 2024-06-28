import React, { useContext, useId, useState } from "react";
import Input from "../components/Input";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import AppContext from "../context/AppContext";
import Menu from "../components/Menu";
import { v4 } from 'uuid'
import Message from "../components/Message";
import Loading from "../components/Loading";


const CreateMachines = () => {

    const { setShowMessage, documents, loading } = useContext(AppContext);

    const [modelMachine, setModelMachine] = useState('');
    const [numberSerie, setNumberSerie] = useState('');
    const [description, setDescription] = useState('');
    const [amountTray, setAmountTray] = useState('');
    const [amountProductTray, setAmountProductTray] = useState('');
    const [garantia, setGarantia] = useState('');
    const [status, setStatus] = useState('');
    const [selectCompany, setSelectCompany] = useState('');

    console.log('selectd', selectCompany)

    const handleSelectCompany = (e) => {

        setSelectCompany(e.target.value)
    }

    const uniqueId = v4()
    const idGenerator = uniqueId.slice(0, 8);

    const handleModelMachine = (e) => {
        setModelMachine(e);
    }

    const handleNumberSerie = (e) => {
        setNumberSerie(e);
    }

    const handleDescription = (e) => {
        setDescription(e);
    }

    const handleAmountTray = (e) => {
        setAmountTray(e);
    }

    const handleAmountProductTray = (e) => {
        setAmountProductTray(e);
    }

    const handleGarantia = (e) => {
        setGarantia(e);
    }

    const handleStatus = (e) => {
        setStatus(e);
    }





    const handleUpdate = async (modelMachine, numberSerie, description, amountTray, amountProductTray, garantia, status) => {
        const docRef = doc(firestore, 'empresa', selectCompany);
        try {
            await updateDoc(docRef, {
                machines: arrayUnion({
                    id: idGenerator,
                    modelMachine,
                    numberSerie,
                    description,
                    amountTray,
                    amountProductTray,
                    garantia,
                    status,
                    bandejas: [],
                    location: [],
                    chamados: [],
                    companyDoc: selectCompany
                })
            })
            console.log('registrado com sucesso');
            setAmountProductTray('');
            setAmountTray('');
            setDescription('');
            setGarantia('');
            setModelMachine('');
            setNumberSerie('');
            setStatus('');
            setShowMessage(true);

            setTimeout(() => {
                window.location.href = '/maquinas';
            }, 2000)

        } catch (error) {
            console.log(error)
        }
    }




    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(modelMachine, numberSerie, description, amountTray, amountProductTray, garantia, status);


    }


    return (
        <>

            <Menu></Menu>

            {loading ?


                <Loading></Loading>
                :
                <div className="wrapper-page">

                    <Header></Header>
                    <TitlePage title="Cadastro Máquinas"></TitlePage>
                    <Message text="Máquina criada com sucesso!"></Message>
                    <div className="form-create">
                        <form method="post" onSubmit={handleSubmit} >
                            <Input
                                label="Modelo da Máquina"
                                name="machine"
                                type="text"
                                change={handleModelMachine}
                                value={modelMachine}

                            ></Input>

                            <Input
                                label="N° de serie "
                                name="serie"
                                type="text"
                                change={handleNumberSerie}
                                value={numberSerie}

                            ></Input>
                            <Input
                                label="Descrição"
                                name="description"
                                type="text"
                                change={handleDescription}
                                value={description}
                            ></Input>
                            <Input
                                label="Quantidade de Bandejas"
                                name="amount_bandeja"
                                type="number"
                                change={handleAmountTray}
                                value={amountTray}
                            ></Input>

                            <Input
                                label="Quantidade de produtos por bandeja"
                                name="product_bandeja"
                                type="number"
                                change={handleAmountProductTray}
                                value={amountProductTray}
                            ></Input>
                            <Input
                                label="Garantia"
                                name="garantia"
                                type="text"
                                change={handleGarantia}
                                value={garantia}
                            ></Input>
                            <Input
                                label="Status do produto"
                                name="inscricao"
                                type="text"
                                value={status}
                                change={handleStatus}
                            ></Input>

                            <div className="form-group form-select mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecione a empresa</label>
                                <select required onChange={handleSelectCompany} value={selectCompany} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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


                            <div className="wrapper-button-form">
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Salvar</button>
                            </div>

                        </form>
                    </div>
                </div>
            }

        </>

    )

}

export default CreateMachines;