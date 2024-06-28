import React, { useContext, useEffect, useState } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import { useParams } from "react-router-dom";
import { firestore } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import AppContext from "../context/AppContext";
import Message from "../components/Message";



const PermissionMachine = () => {

    const { setShowMessage } = useContext(AppContext);
    const { machineId, docCompany } = useParams();
    const [listFunc, setListFunc] = useState([]);
    const [selectedFuncs, setSelectedFuncs] = useState([]);


    console.log('user', selectedFuncs.length)



    useEffect(() => {
        const loadPermissionsUser = async () => {
            try {
                const docRef = doc(firestore, 'empresa', docCompany);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const companyData = docSnapshot.data();
                    setListFunc(companyData.funcionarios || []);

                    // Se houver uma lista de permissões para essa máquina, carregue-a
                    const machine = companyData.machines.find(machine => machine.id === machineId);
                    if (machine && machine.permissions) {
                        setSelectedFuncs(machine.permissions);
                    }
                } else {
                    console.log('Documento da empresa não encontrado');
                }
            } catch (error) {
                console.error('Erro ao carregar permissões:', error);
            }
        };

        loadPermissionsUser();


    }, [machineId, docCompany]);

    // Função para salvar as permissões
    const savePermissions = async () => {
        try {
            const docRef = doc(firestore, 'empresa', docCompany);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const companyData = docSnapshot.data();
                const machines = companyData.machines.map(machine => {
                    if (machine.id === machineId) {
                        return {
                            ...machine,
                            permissions: selectedFuncs
                        };
                    }
                    return machine;
                });

                // Atualizar o documento da empresa com as novas permissões
                await updateDoc(docRef, { machines });
                setShowMessage(true)
                window.location.href = '/maquinas';
            } else {
                console.log('Documento da empresa não encontrado');
            }
        } catch (error) {
            console.error('Erro ao salvar permissões:', error);
        }
    };

    // Função para lidar com a alteração do checkbox
    const handleCheckboxChange = (funcId) => {
        setSelectedFuncs(prevSelectedFuncs =>
            prevSelectedFuncs.includes(funcId)
                ? prevSelectedFuncs.filter(id => id !== funcId)
                : [...prevSelectedFuncs, funcId]
        );
    };



    return (
        <>
            <Menu></Menu>
            <div className="wrapper-page">
                <Header></Header>
                <TitlePage title="Permissão de Máquina"></TitlePage>

                <Message text="Permissões atualizadas com sucesso!"></Message>
                <div className="form-create">
                    <form method="post" onSubmit={e => { e.preventDefault(); savePermissions(); }}>
                        {listFunc.length > 0 ?

                            <>
                                {listFunc.map(func => (
                                    <div key={func.idFunc} className="combo-checkbox flex items-center">

                                        <input checked={selectedFuncs.includes(func.idFunc)} onChange={() => handleCheckboxChange(func.idFunc)} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label for="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{func.name}</label>
                                    </div>


                                ))}
                            </>

                            :
                            <p id="alert-border-2" className="flex gap-3 items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
                                <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                É necessário cadastrar usuários para poder dar permissões de máquinas</p>
                        }




                        {listFunc.length > 0 &&
                            <div className="wrapper-button-form mt-4">
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Permitir</button>
                            </div>
                        }

                    </form>
                </div>
            </div>
        </>

    )

}

export default PermissionMachine