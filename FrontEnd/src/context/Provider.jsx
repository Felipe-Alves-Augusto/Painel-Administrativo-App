import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import { getMe, getToken } from "../services/auth";
// import { firestore } from "../../firebaseConfig";
import { firestore } from "../firebaseConfig";
import { getDocs, collection, getDoc, doc } from "firebase/firestore";

const Provider = (props) => {

    const [showMessage, setShowMessage] = useState(false);
    const [showMessageError, setShowMessageError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setDataUser] = useState([]);
    const [dataCompany, setDataCompany] = useState([]);
    const [funcionario, setFuncionario] = useState(null);
    const [tokenUser, setTokenUser] = useState('');
    const [documents, setDocuments] = useState([]);
    const [machinesPermission, setMachines] = useState([]);


    const fetchDocuments = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'empresa'));
            const docs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }));
            setDocuments(docs);
        } catch (error) {
            console.error('Erro ao buscar documentos: ', error);
        } finally {
            setLoading(false)
        }

    };



    // Supondo que o funcionário esteja autenticado e suas informações estão disponíveis no contexto ou estado


    // Verificar se o funcionário está associado à empresa
    // função para pegar o funcionario logado
    const checkAccess = async () => {


        if (userData.company_doc != null) {
            try {
                const empresaDoc = await getDoc(doc(firestore, 'empresa', userData.company_doc));

                if (empresaDoc.exists()) {
                    const empresaData = empresaDoc.data();
                    setDataCompany({
                        id: userData.company_doc,
                        data: empresaDoc.data()
                    })

                    empresaData.funcionarios.map((user) => {

                        if (user.email === userData.email) {
                            console.log('funcionario logado', user);
                            setFuncionario(user);
                        }

                    })


                } else {
                    console.log('a empresa não existe')
                }

            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false)
            }
        }


    };



    const dataUser = async () => {
        try {
            const user = await getMe();
            setDataUser(user);
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    const selectCompany = async (userId) => {

        try {
            const querySnapShot = await getDocs(collection(firestore, 'empresa'));
            querySnapShot.forEach((doc) => {
                if (userId === doc.data().idUser) {
                    setDataCompany({
                        id: doc.id,
                        data: doc.data()
                    });
                }
            });
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }


    };

    useEffect(() => {
        fetchDocuments()
    }, [userData]);

    useEffect(() => {

        if (userData) {
            checkAccess()
        }
    }, [userData])


    useEffect(() => {

        dataUser();

    }, []);

    useEffect(() => {

        if (userData) {
            selectCompany(userData.id);
        }


    }, [userData]);

    useEffect(() => {
        const loadUserPermissionsMachine = async () => {
            // Verifica se userData e funcionario estão definidos
            if (!userData?.company_doc || !funcionario?.idFunc) {
                return;
            }

            try {
                // Obtém o documento da empresa
                const companyDoc = await getDoc(doc(firestore, 'empresa', userData.company_doc));
                if (companyDoc.exists()) {
                    const companyData = companyDoc.data();

                    // Verifica se existem máquinas e o array de permissões
                    if (companyData.machines && companyData.machines.length > 0) {
                        const permittedMachines = companyData.machines.filter(machine =>
                            machine.permissions && machine.permissions.includes(funcionario.idFunc)
                        );

                        // Atualiza o estado com as máquinas permitidas
                        setMachines(permittedMachines);
                    } else {
                        console.log('Nenhuma máquina encontrada ou estrutura de máquinas inválida.');
                    }
                } else {
                    console.log('Empresa não encontrada.');
                }
            } catch (error) {
                console.error('Erro ao carregar permissões do usuário:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserPermissionsMachine();
    }, [userData, funcionario]);


    return (
        <AppContext.Provider value={{
            showMessage,
            setShowMessage,
            loading,
            setLoading,
            dataCompany,
            userData,
            showMessageError,
            setShowMessageError,
            funcionario,
            tokenUser,
            documents,
            machinesPermission

        }}>
            {props.children}
        </AppContext.Provider>
    )

}

export default Provider;