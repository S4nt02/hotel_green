import React from 'react'
import { Link } from 'react-router-dom'; //import para usar rotas
import { useEffect, useState } from 'react' //import para recuperar dados do back
import { API_URL } from '../../url';
import HeaderComponente from '../../componetes/header/headerComponente';
import { User, Phone, MapPin, Calendar, Flag, Home, Mail, IdCard, FileText, Lock, MapPinHouse, Building2, Landmark, Building, Map } from 'lucide-react';
import { useForm} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

function PerfilPage(){
    return(
        <>
            <h1>Página de perfil</h1>
        </>
    )
        
    
    
}

export default PerfilPage