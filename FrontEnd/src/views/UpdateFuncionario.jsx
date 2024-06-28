import React, { useContext, useState, useEffect } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import Message from "../components/Message";
import Input from "../components/Input";
import AppContext from "../context/AppContext";
import { firestore } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import { updateUser } from "../services/auth";

const UpdateFuncionario = () => {


    const { dataCompany, setShowMessage, setShowMessageError, documents, loading } = useContext(AppContext);

    const { idFunc, docCompany } = useParams();


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [typeUser, setTypeUser] = useState('');
    const [telUser, setTelUser] = useState('');
    const [getIdFunc, setIdFunc] = useState('');





    const handleTel = (e) => {
        setTelUser(e);
    }

    const handleTypeUser = (e) => {
        setTypeUser(e.target.value);
    }


    const handleName = (e) => {
        setName(e);
    }


    const handleEmail = (e) => {
        setEmail(e);
    }

    const handlePassword = (e) => {
        setPassword(e);

    }

    useEffect(() => {
        const getDataFunc = async () => {
            try {
                const companyRef = doc(firestore, "empresa", docCompany);
                const companyDoc = await getDoc(companyRef);

                if (companyDoc.exists()) {
                    const companyData = companyDoc.data();
                    const user = companyData.funcionarios.find(emp => emp.idFunc === idFunc);
                    console.log('user', user)
                    setName(user.name);
                    setEmail(user.email);
                    setPassword(user.password);
                    setTelUser(user.telefone);
                    setIdFunc(user.idFunc);
                    return user || null;
                }
                return null;
            } catch (error) {
                console.error("Erro ao buscar dados do funcionário:", error);
                throw error;
            }
        }

        getDataFunc()

    }, [idFunc, docCompany])

    const handleUpdate = async (name, email, password, telefone, typeUser) => {
        try {
            // Referência ao documento no Firestore
            const docRef = doc(firestore, 'empresa', docCompany);

            // Obtém o documento atual
            const docSnapshot = await getDoc(docRef);
            if (!docSnapshot.exists()) {
                throw new Error("Documento não encontrado");
            }

            // Obtém os dados atuais da empresa
            const companyData = docSnapshot.data();
            const user = companyData.funcionarios || [];

            // Atualiza as informações da localização específica
            const updatedUser = user.map(func => {
                if(func.idFunc === idFunc){
                    return {
                        ...func,
                        name,
                        email,
                        password,
                        telefone,
                        typeUser
                        
                    };
                } else {
                    return func
                }
                    
                
                
            });

            // Atualiza o documento no Firestore
            await updateDoc(docRef, { funcionarios: updatedUser });
            setShowMessage(true);

            console.log('Usuário atualizado com sucesso!');
            setTimeout(() => {
                window.location.href = '/funcionarios';
            }, 2000)
        } catch (error) {
            console.error('Erro ao atualizar a localização:', error);
        }
    };


    // const handleInsert = async (name, email, password, telefone, typeUser) => {
    //     const docRef = doc(firestore, 'empresa', selectCompany);
    //     try {
    //         await updateDoc(docRef, {
    //             funcionarios: arrayUnion({
    //                 name,
    //                 email,
    //                 password,
    //                 telefone,
    //                 typeUser,
    //             })
    //         })

    //         setName('');
    //         setConfirmPassword('');
    //         setEmail('');
    //         setPassword('');
    //         setShowMessage(true);


    //         setTimeout(() => {
    //             window.location.href = '/funcionarios';
    //         }, 2000)

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    const handleSubmit = async (e) => {
        e.preventDefault();
       

        if (password.length >= 6) {
            await handleUpdate(name, email, password, telUser, typeUser);
            await updateUser(name, email, password, telUser, typeUser, idFunc);

            console.log('registrado com sucesso');
            setShowMessageError(false);

        } else {
            setShowMessageError(true);
        }
    }

    return (

        <>
            <Menu></Menu>
            {loading ?
                <Loading></Loading>

                :

                <div className="wrapper-page">
                    <Header></Header>
                    <TitlePage title="Editar Usuário"></TitlePage>
                    <Message text="Usuário editado com sucesso!" textError="A senha precisa ter no mínimo 6 caracteres!"></Message>
                    <div className="form-create">
                        <form onSubmit={handleSubmit} method="post">
                            <Input
                                label="Nome"
                                name="name"
                                type="text"
                                value={name}
                                change={handleName}

                            ></Input>

                            <Input
                                label="E-mail"
                                name="email"
                                type="email"
                                value={email}
                                change={handleEmail}

                            ></Input>

                            <Input
                                label="Senha"
                                name="password"
                                type="password"
                                value={password}
                                change={handlePassword}

                            ></Input>


                            <Input
                                label="Telefone"
                                name="phone"
                                type="text"
                                change={handleTel}
                                value={telUser}
                                mask="(99) 9999-99999"

                            ></Input>




                            <div className="form-group flex items-center gap-7">
                                <div className="combo-radio flex items-center">

                                    <input onChange={handleTypeUser} type="radio" value="adm" name="type_user" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="default-radio-2" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">ADM</label>
                                </div>

                                <div className="combo-radio flex items-center">

                                    <input onChange={handleTypeUser} type="radio" value="proprietario" name="type_user" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="default-radio-2" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Proprietário</label>
                                </div>

                                <div className="combo-radio flex items-center">

                                    <input onChange={handleTypeUser} type="radio" value="tecnico" name="type_user" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="default-radio-2" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Técnico</label>
                                </div>


                                <div className="combo-radio flex items-center">

                                    <input onChange={handleTypeUser} type="radio" value="consierge" name="type_user" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label for="default-radio-2" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Consierge</label>
                                </div>

                            </div>

                            <div className="wrapper-button-form mt-4">
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Editar</button>
                            </div>
                        </form>
                    </div>
                </div>
            }

        </>

    )

}


export default UpdateFuncionario;