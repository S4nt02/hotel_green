import React from 'react';
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { coerce, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm} from 'react-hook-form';
import { API_URL } from '../../url';
import HeaderComponente from '../../componetes/header/headerComponente';
import CadCategoria from '../../componetes/cad_categoria/cad_categoria';
import CadItens from '../../componetes/cad_itens/cadItens';
import "./itens.css"

function Itens (){

    const [formSelecionado, setFormSelecionado] = useState(null);
    const selecionarFormulario = (formId) => setFormSelecionado(formId)

    useEffect(() => {
        selecionarFormulario(1)
    },[])

    return(
        
        <>
            <main>
                <HeaderComponente/>
                <h1 className='itens-title'>Sistema de Itens</h1>
                <div className='alinhar-menu'>
                    <div className='style-menu'>
                        <div className='alinhar-menu'>
                            <div className='menu-itens'>
                                <div onClick={() => selecionarFormulario(1)} >Itens</div>
                                <div  onClick={() => selecionarFormulario(2)} >Categorias</div>
                            </div>
                        </div>

                        {formSelecionado == 1 && (
                            <>
                                <CadItens/>
                            </>
                        )}

                        {formSelecionado == 2 && (
                            <>
                                <CadCategoria/>
                            </>
                        )} 
                    </div>

                </div>


            </main>
        </>
    )
}

export default Itens