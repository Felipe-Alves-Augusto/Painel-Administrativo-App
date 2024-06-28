import React, { useContext, useState } from "react";
import Menu from "../components/Menu";
import Header from "../components/Header";
import TitlePage from "../components/TitlePage";
import Message from "../components/Message";
import Input from "../components/Input";
import AppContext from "../context/AppContext";
import { firestore } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { registerFunc } from "../services/auth";
import Loading from "../components/Loading";
import { v4 } from 'uuid'

const CreateFuncionarios = () => {


    const { dataCompany, setShowMessage, setShowMessageError, documents, loading } = useContext(AppContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [typeUser, setTypeUser] = useState('');
    const [telUser, setTelUser] = useState('');

    const [selectCompany, setSelectCompany] = useState('');

    const uniqueId = v4()
    const idGenerator = uniqueId.slice(0, 8);

    const handleSelectCompany = (e) => {

        setSelectCompany(e.target.value)
    }




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

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e);
    }

    const handleInsert = async (name, email, password, telefone, typeUser) => {
        const docRef = doc(firestore, 'empresa', selectCompany);
        try {
            await updateDoc(docRef, {
                funcionarios: arrayUnion({
                    name,
                    email,
                    password,
                    telefone,
                    typeUser,
                    idFunc: idGenerator,
                    permission: []
                })
            })

            setName('');
            setConfirmPassword('');
            setEmail('');
            setPassword('');
            setShowMessage(true);


            setTimeout(() => {
                window.location.href = '/funcionarios';
            }, 2000)

        } catch (error) {
            console.log(error)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(typeUser)
        console.log(name)

        if (password.length >=6) {
            await handleInsert(name, email, password, telUser, typeUser);
            await registerFunc(
                name,
                email,
                password,
                telUser,
                'N/D',
                'N/D',
                typeUser,
                selectCompany,
                idGenerator
            )

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
                    <TitlePage title="Cadastro de Usuários"></TitlePage>
                    <Message text="Usuário cadastrado com sucesso!" textError="A senha precisa ter no mínimo 6 caracteres!"></Message>
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
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Cadastrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            }

        </>

    )

}


export default CreateFuncionarios;