import React from "react";


const Forbidden = () => {

    return (
        <div className="forbidden">
            <div className="wrapper-forbidden">
                <h1 className="text-6xl text-center font-semibold mb-3">403</h1>

                <h2 className="text-center text-4xl font-semibold">Não Permitido</h2>
                <p className="text-center font-normal mt-6">Faça o login para ter acesso a está página clicando <a href="/login">aqui</a></p>
            </div>
        </div>
    )


}


export default Forbidden;