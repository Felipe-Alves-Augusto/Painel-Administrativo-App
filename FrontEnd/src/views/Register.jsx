import React, { useContext, useState } from "react";
import { register } from "../services/auth";
import Input from "../components/Input";
import Message from "../components/Message";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";


const Register = () => {

    const navigate = useNavigate();



    const { setShowMessage, setLoading, setShowMessageError } = useContext(AppContext);

    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState('');
    const [typeUser, setTypeUser] = useState('adm');
    const [errorText, setErrorText] = useState('');


    const handleName = (e) => {
        setUsername(e)
    }

    const handleEmail = (e) => {
        setEmail(e)
    }

    const handlePassword = (e) => {
        setPassword(e);
    }

    const handlePhone = (e) => {
        setPhone(e);
    }

    const handleAddress = (e) => {
        setAddress(e);
    }

    const handleCep = (e) => {
        setCep(e);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password.length < 6) {
            setShowMessageError(true);
            setErrorText('A senha deve ter no mínimo 6 caractéres');

        } else {
            try {
                const data = await register(name, email, password, phone, cep, address, typeUser);
                console.log('usuário cadastrado com sucesso', data);
                setEmail('');
                setUsername('');
                setPassword('');
                setShowMessage(true);
                setLoading(false);

                setTimeout(() => {
                    window.location.href = '/home';
                }, 2000)

            } catch (error) {
                console.log(error);
            }
        }


    }

    return (
        <>
            <Message text="Registrado com sucesso!" textError={errorText}></Message>
            <div className="register wrapper-form">

                <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                    <Loading></Loading>
                    <div className="title">
                        <p>Registre-se para para administrar seu négocio</p>
                    </div>
                    <Input
                        label="Nome"
                        name="name"
                        type="text"
                        placeholder="Nome Completo"
                        change={handleName}
                        value={name}

                    ></Input>

                    <Input
                        label="E-mail"
                        name="email"
                        type="email"
                        placeholder="E-mail"
                        change={handleEmail}
                        value={email}

                    ></Input>

                    <Input
                        label="Senha"
                        name="password"
                        type="password"
                        placeholder="Senha"
                        change={handlePassword}
                        value={password}

                    ></Input>

                    <Input
                        label="Celular"
                        name="phone"
                        type="text"
                        placeholder="Celular"
                        change={handlePhone}
                        value={phone}
                        mask="(99) 9999-99999"

                    ></Input>

                    <Input
                        label="CEP"
                        name="cep"
                        type="text"
                        placeholder="CEP"
                        change={handleCep}
                        value={cep}
                        mask="99999-999"

                    ></Input>

                    <Input
                        label="Endereço"
                        name="address"
                        type="text"
                        placeholder="Endereço"
                        change={handleAddress}
                        value={address}

                    ></Input>




                    <div className="wrapper-button-form">
                        <button type="submit" className="text-white mt-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Registra-se</button>
                    </div>

                    <div className="alredy-account">
                        <p>Já tem uma conta? <a href="/login">Entrar aqui</a></p>
                    </div>
                </form>
            </div>
        </>

    )

}


export default Register