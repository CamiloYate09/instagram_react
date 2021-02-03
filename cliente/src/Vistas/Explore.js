import React,{useState, useEffect} from "react";
import Main from "../Componentes/Main";
import {Link} from "react-router-dom";
import Loading from "../Componentes/Loading";
import {ImagenAvatar} from "../Componentes/Avatar";
import Grid from "../Componentes/Grid";
import Axios from "axios";

export default function Explore({mostrarError}){
    const [posts, setPosts] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function cargarPostYUsuarios(){
            try {
                const [posts, usuarios] = await Promise.all([
                    Axios.get('/api/posts/explore').then(({data}) => data),
                    Axios.get('/api/usuarios/explore').then(({data}) => data)
                ]);
                setPosts(posts);
                setUsuarios(usuarios);
                setLoading(false);
            }catch (error){
                mostrarError('Hubo un problema cargando explore. Por favor refresca la página');
                console.log(error);
            }
        }
        cargarPostYUsuarios();

    },[])

    if(loading){
        return (
            <Main center>
                <Loading/>
            </Main>
        )
    }

    return(
        <Main center>
            <div >
                <h2 className="Explore__title">Descubrir usuarios</h2>
                <div className="Explore__usuarios-container">
                    {usuarios.map(usuario =>{
                        return(
                            <div className="Explore__usuario" key={usuario._id}>
                                <ImagenAvatar usuario={usuario}/>
                                <p>{usuario.username}</p>
                                <Link to={`/perfil/${usuario.username}`}>ver peril</Link>
                            </div>
                        )
                    })

                    }
                </div>
            </div>
            <div>
                <h2 className="Explore__title"></h2>
                <Grid posts={posts}></Grid>
            </div>

        </Main>


    )

}