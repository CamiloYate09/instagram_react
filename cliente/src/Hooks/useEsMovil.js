import {useState, useEffect} from 'react';

export default function useEsMovil(){
    const [esMobil, setEsMovil] = useState(null);

    /**
     * medir el tamaño de una pantalla si es movil o ni
     */
    useEffect(() =>{
       const mql = window.matchMedia('(min-width: 576px)');
       mql.addListener(reavisarSiEsMobil);

       function reavisarSiEsMobil(){
           if(mql.matches){
               setEsMovil(false);
           }else{
               setEsMovil(true);
           }
       }
        reavisarSiEsMobil();
       return () => mql.removeListener(reavisarSiEsMobil());
    },[]);

    return esMobil;
}