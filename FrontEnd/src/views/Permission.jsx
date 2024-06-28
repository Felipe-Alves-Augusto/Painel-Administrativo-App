import React, { useEffect, useState } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import { useParams } from "react-router-dom";
import { firestore } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";



const Permission = () => {


    const { idFunc, docCompany } = useParams();

    const [pageDash, setPageDash] = useState(false);
    const [pageUser, setPageUser] = useState(false);
    const [pageEmpresa, setPageEmpresa] = useState(false);
    const [pageMaquina, setPageMaquina] = useState(false);
    const [pageBandeja, setPageBandeja] = useState(false);
    const [pageLocacao, setPageLocacao] = useState(false);
    const [pageChamados, setPageChamados] = useState(false);
    // const [pageRelatorios, setPageRelatorios] = useState(false);
    const [pageConfig, setPageConfig] = useState(false);
    const [pageAbastecimento, setPageAbastecimento] = useState(false);


    useEffect(() => {
        const loadPermissions = async () => {
            try {
                const docRef = doc(firestore, 'empresa', docCompany);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const companyData = docSnapshot.data();
                    const user = companyData.funcionarios.find(user => user.idFunc === idFunc);

                    if (user && user.permission) {
                        // Atualiza os estados dos checkboxes com base nas permissões do usuário
                        setPageDash(user.permission.pageDashboard || false);
                        setPageUser(user.permission.pageUser || false);
                        setPageEmpresa(user.permission.pageEmpresa || false);
                        setPageMaquina(user.permission.pageMaquina || false);
                        setPageBandeja(user.permission.pageBandeja || false);
                        setPageLocacao(user.permission.pageLocacaoVenda || false);
                        setPageChamados(user.permission.pageChamados || false);
                        // setPageRelatorios(user.permission.pageRelatorio || false);
                        setPageConfig(user.permission.pageConfiguracao || false);
                        setPageAbastecimento(user.permission.pageAbastecimento || false);
                    } else {
                        console.log('Funcionário ou permissões não encontradas');
                    }
                } else {
                    console.log('Documento da empresa não encontrado');
                }
            } catch (error) {
                console.error('Erro ao carregar permissões:', error);
            }
        };



        loadPermissions();

    }, [idFunc, docCompany])



    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        switch (name) {

            case 'pageDash':
                setPageDash(checked);
                break;

            case 'pageUser':
                setPageUser(checked);
                break;
            case 'pageEmpresa':
                setPageEmpresa(checked);
                break;
            case 'pageMaquina':
                setPageMaquina(checked);
                break;
            case 'pageBandeja':
                setPageBandeja(checked);
                break;
            case 'pageLocacao':
                setPageLocacao(checked);
                break;
            case 'pageChamados':
                setPageChamados(checked);
                break;

            case 'pageConfig':
                setPageConfig(checked);
                break;

            case 'pageAbastecimento':
                setPageAbastecimento(checked);
                break;
            default:
                break;
        }
    };



    const handleUpdate = async () => {
        try {
            // Refere-se ao documento da empresa com base no ID da empresa selecionada
            const docRef = doc(firestore, 'empresa', docCompany);

            // Obtém o documento da empresa
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                // Obtém os dados da empresa
                const companyData = docSnapshot.data();

                // Obtém os funcionários ou inicializa um array vazio se não existirem
                const func = companyData.funcionarios || [];

                // Atualiza os funcionários para modificar as permissões no funcionário correto
                const updatedFunc = func.map(user => {
                    if (user.idFunc === idFunc) { // Certifica-se de que estamos no funcionário correto
                        // Atualiza as permissões existentes
                        const updatedPermission = {
                            ...user.permission, // Mantém as permissões existentes
                            pageBandeja: pageBandeja,
                            pageChamado: pageChamados,
                            pageConfiguracao: pageConfig,
                            pageDashboard: pageDash,
                            pageEmpresa: pageEmpresa,
                            pageLocacaoVenda: pageLocacao,
                            pageMaquina: pageMaquina,
                            // pageRelatorio: pageRelatorios,
                            pageUser: pageUser,
                            pageAbastecimento: pageAbastecimento


                        };

                        return {
                            ...user,
                            permission: updatedPermission // Atualiza as permissões
                        };
                    } else {
                        // Retorna o usuário inalterado
                        return user;
                    }
                });

                // Atualiza o documento no Firestore com as alterações
                await updateDoc(docRef, {
                    funcionarios: updatedFunc
                });

                console.log('Permissões atualizadas com sucesso');

                // Redireciona após 2 segundos
                setTimeout(() => {
                    window.location.href = '/funcionarios';
                }, 2000);
            } else {
                console.log('Documento da empresa não encontrado');
            }
        } catch (error) {
            console.error('Erro ao atualizar permissões:', error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleUpdate();

    }

    return (
        <>
            <Menu></Menu>
            <div className="wrapper-page">
                <Header></Header>
                <TitlePage title="Permissões"></TitlePage>
                <div className="form-create">
                    <form onSubmit={handleSubmit} method="post">


                        <div className="form-group group-checkbox flex items-center gap-7 flex-wrap">


                            <div className="combo-checkbox flex items-center">

                                <input checked={pageDash} name="pageDash" id="dash" onChange={handleCheckboxChange} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">DashBoard</label>
                            </div>

                            <div className="combo-checkbox flex items-center">

                                <input checked={pageUser} name="pageUser" id="user" onChange={handleCheckboxChange} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Usuários</label>
                            </div>

                            <div className="combo-checkbox flex items-center">

                                <input checked={pageEmpresa} name="pageEmpresa" id="empresa" onChange={handleCheckboxChange} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Empresas</label>
                            </div>
                            <div className="combo-checkbox flex items-center">

                                <input checked={pageMaquina} name="pageMaquina" id="maquina" onChange={handleCheckboxChange} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Máquinas</label>
                            </div>

                            <div className="combo-checkbox flex items-center">

                                <input checked={pageBandeja} name="pageBandeja" id="bandeja" onChange={handleCheckboxChange} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bandejas</label>
                            </div>

                            <div className="combo-checkbox flex items-center">

                                <input checked={pageLocacao} name="pageLocacao" id="locacao" onChange={handleCheckboxChange} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Locação/Venda</label>
                            </div>

                            <div className="combo-checkbox flex items-center">

                                <input checked={pageChamados} name="pageChamados" id="chamado" onChange={handleCheckboxChange} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Chamados</label>
                            </div>



                            <div className="combo-checkbox flex items-center">

                                <input checked={pageConfig} name="pageConfig" id="configuracao" onChange={handleCheckboxChange} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Configurações</label>
                            </div>

                            <div className="combo-checkbox flex items-center">

                                <input checked={pageAbastecimento} name="pageAbastecimento" id="abastecimento" onChange={handleCheckboxChange} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label for="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Abastecimento</label>
                            </div>


                        </div>

                        <div className="wrapper-button-form mt-4">
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Cadastrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>

    )

}

export default Permission