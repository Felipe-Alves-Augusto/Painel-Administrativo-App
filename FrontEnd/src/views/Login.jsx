import React, { useState, useContext } from "react";
import { login } from "../services/auth";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import Message from "../components/Message";
import Loading from "../components/Loading";



const Login = () => {

    const navigate = useNavigate();

    const {setLoading, setShowMessageError} = useContext(AppContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // setLoading(true);

    const handleEmail = (e) => {
        setEmail(e)
    }

    const handlePassword = (e) => {
        setPassword(e);
    }


    const handleSubmit = async (e) => {
        e.preventDefault(e);
        setLoading(true)

        try {
            
            await login(email, password);
            
            
            window.location.href = '/home';


        } catch (error) {
            setPassword('');
            setLoading(false);
            setShowMessageError(true);
            //console.log(error.response.data);
        }
    }


    return (
        <>
            <Message textError="E-mail/senha incorretos!"></Message>
            <div className="login wrapper-form">
                <form onSubmit={handleSubmit} class="max-w-sm mx-auto">
                    <Loading></Loading>
                    <div className="title">
                        <p>Acesse o painel</p>
                    </div>


                    <Input
                        label="E-mail"
                        name="email"
                        type="email"
                        change={handleEmail}
                        value={email}

                    ></Input>

                    <Input
                        label="Senha"
                        name="password"
                        type="password"
                        change={handlePassword}
                        value={password}

                    ></Input>



                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Entrar</button>
                    <div className="alredy-account">
                        <p>Ainda não tem uma conta? <a href="/registro">Cadastre-se aqui</a></p>
                    </div>
                </form>
            </div>
        </>

    )

}


export default Login