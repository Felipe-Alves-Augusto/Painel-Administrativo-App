import React from "react";
import './SectionGestao.css';

const SectionGestao = () => {

    return (
        <section className="section-gestao mt-6">
            <div className="container mx-auto px-4">
                <div className="title-section">
                    <h2 className="text-4xl font-bold title-main text-gray-900 text-center">Sistema de Gestão</h2>
                    <p className="text-center text-2xl title-secondary">completo</p>
                </div>

                <div className="wrapper-section-gestao">
                    <div className="img-gestao">
                        <img src="https://previews.123rf.com/images/fad82/fad821801/fad82180100026/94029276-computer-screen-with-financial-charts-and-graphs-isolated-on-white-vector-illustration.jpg" />
                    </div>

                    <div className="content-gestao">
                        <p className="text-2xl title-secondary">gráficos</p>
                        <h2 className="text-4xl font-bold title-main text-gray-900">Informações Detalhadas</h2>
                        <p className="text-description">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore ea dolorem quaerat aspernatur quia facilis rem vero suscipit minima. Ab repellendus molestiae veritatis natus excepturi at ipsam voluptates dolorem quidem.
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum ea voluptatum dolor saepe iste illo nesciunt sunt hic consectetur, iusto impedit voluptatem temporibus et? Repellat eos minus explicabo placeat ratione?
                            <br />
                            <br />
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus animi at, nisi unde sapiente dolor hic, atque explicabo sed dolore, officia provident distinctio vel cupiditate fugit omnis rerum sit tempore?
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionGestao