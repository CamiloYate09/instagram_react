import React, {useState, useEffect} from "react";
import Main from "../Componentes/Main";
import Loading from "../Componentes/Loading";
import Grid from "../Componentes/Grid";
import RecursoNoExiste from "../Componentes/RecursoNoExiste";
import Axios from "axios";
import stringToColor from 'string-to-color';
import toggleSiguiendo from '../Helpers/amistad-helpers'
import useEsMovil from "../Hooks/useEsMovil";


export default  function Perfil({mostrarError, usuario, match, logout}){
    const username = match.params.username;
    console.log(username);
    const [usuarioDueñoDelPerfil, setUsuarioDueñoDelPerfil ] = useState(null);
    const [posts, setPosts] = useState([]);
    const [cargandoPerfil, setCargandoPerfil ] = useState(true);
    const [perfilNoExiste, setPerfilNoExiste] = useState(false);
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [enviandoAmistad, setEnviandoAmistad] = useState(false);
    const esMobil = useEsMovil();



    useEffect(() => {
        async function cargarPostsYUsuario(){
            try {
                setCargandoPerfil(true);
                const {data : usuario} = await Axios.get(`/api/usuarios/${username}`);
                const {data: posts} = await Axios.get(`/api/posts/usuario/${usuario._id}`);
                setUsuarioDueñoDelPerfil(usuario);
                setPosts(posts);
                setCargandoPerfil(false);
            }catch (error) {
                if(error.response && (error.response.status === 404 || error.response.status === 400)){
                    setPerfilNoExiste(true);
                }else{
                    mostrarError('Hubo un problema cargando este perfil.');
                }
                setCargandoPerfil(false);

            }
        }
        cargarPostsYUsuario();
    }, [username]);

    /**
     * funcion para validar si estamos buscando nuestro mismo perfil o el de otro.
     * @returns {boolean}
     */
    function esElPerfilDeLaPersonaLogin(){
        return usuario._id === usuarioDueñoDelPerfil._id;
    }

    async function handleImagenSeleccionada(evento){
        try {
            setSubiendoImagen(true);
            const file = evento.target.files[0];
            const config = {
                headers:{
                    'Content-Type': file.type
                }
            }
            const {data} = await Axios.post('/api/usuarios/upload', file,config);
            setUsuarioDueñoDelPerfil({...usuarioDueñoDelPerfil, imagen: data.url});
            setSubiendoImagen(false);

        }catch (error) {
        mostrarError(error.response.data);
            setSubiendoImagen(false);
            console.log(error);
        }
    }

    async function ontoggleSiguiendo(){
        if(enviandoAmistad){
            return;
        }
        try {
            setEnviandoAmistad(true);
            const usuarioActualziado = await toggleSiguiendo(usuarioDueñoDelPerfil);
            setUsuarioDueñoDelPerfil(usuarioActualziado);
            setEnviandoAmistad(false);
        }catch (error) {
            mostrarError('Hubo un problema siguiendo/dejando de seguir a este usuario. Intenta de nuevo');
            setEnviandoAmistad(false);
            console.log(error);
        }
    }


    if(cargandoPerfil){
        return (
            <Main center>
                <Loading/>
            </Main>
        );
    }
    if(perfilNoExiste){
        return (
            <RecursoNoExiste  mensaje="El perfil que estas intentando ver no existe"/>
        );
    }
    if(usuario == null){
        return null;
    }


    return(
        <Main center>
           <div className="Perfil">
               <ImagenAvatar esElPerfilDeLaPersonaLogin={esElPerfilDeLaPersonaLogin()} usuarioDueñoDelPerfil={usuarioDueñoDelPerfil}
               handleImagenSeleccionada={handleImagenSeleccionada} subiendoImagen={subiendoImagen}
               ></ImagenAvatar>
           </div>
            <div className="Perfil__bio-container">
                <div className="Perfil__bio-heading">
                    <h2 className="capitalize">{usuarioDueñoDelPerfil.username}</h2>
                    {
                        !esElPerfilDeLaPersonaLogin() && (
                            <BotonSeguir
                                seguiendo={usuarioDueñoDelPerfil.siguiendo}
                                toggleSiguiento={ontoggleSiguiendo}
                            />
                        )
                    }
                    {
                        esElPerfilDeLaPersonaLogin() && <BotonLogout logout={logout}/>
                    }
                </div>
                {!esMobil  && (
                    <DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil}></DescripcionPerfil>
                )}

            </div>
            {esMobil  && (
                <DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil}></DescripcionPerfil>
            )}

            <div className="Perfil__separador">

            </div>
            {
                posts.length >0 ? <Grid posts={posts}/> : <NoHaPosteadoFotos/>
            }
        </Main>
    )
}
function ImagenAvatar({esElPerfilDeLaPersonaLogin, usuarioDueñoDelPerfil, handleImagenSeleccionada, subiendoImagen }){
    let contenido;
    if(subiendoImagen){
        contenido = <Loading/>
    }else if(esElPerfilDeLaPersonaLogin) {
        contenido = (
            <label className="Perfil__img-placeholder Perfil__img-placeholder--pointer"
                   style={{
                       backgroundImage: usuarioDueñoDelPerfil.imagen ? `url(${usuarioDueñoDelPerfil.imagen})` : null,
                       backgroundColor: stringToColor(usuarioDueñoDelPerfil.username)
                   }}
            >
                <input type="file" onChange={handleImagenSeleccionada} className="hidden" name="imagen"/>
            </label>

        );
    }else {
        contenido = (
            <div className="Perfil__img-placeholder"
                 style={{
                     backgroundImage: usuarioDueñoDelPerfil.imagen ? `url(${usuarioDueñoDelPerfil.imagen})` : null,
                     backgroundColor: stringToColor(usuarioDueñoDelPerfil.username)
                 }}
            >

            </div>
        );
    }

    return <div className="Perfil__img-container">{contenido}</div>
}


function DescripcionPerfil({usuarioDueñoDelPerfil}) {
    return (
        <div className="Perfil__descripcion">
            <h2 className="Perfil__nombre">{usuarioDueñoDelPerfil.nombre}</h2>
            <p>{usuarioDueñoDelPerfil.bio}</p>
            <p className="Perfil__estadisticas">
                <b>{usuarioDueñoDelPerfil.numSeguidores}</b> Following
                <span className="ml-4">
                    <b>{usuarioDueñoDelPerfil.numSeguidores}</b> followers
                </span>
            </p>

        </div>
    );

}

function BotonSeguir({seguiendo, toggleSiguiento}){
    return(
        <button onClick={toggleSiguiento} className="Perfil__boton-seguir">
            {
                seguiendo ? 'Dejar de Seguir': 'Seguir'
            }

        </button>
    );
}

function BotonLogout({logout}){
    return(
        <button className="Perfil__boton-logout" onClick={logout}>
            Logout
        </button>
    )
}
function NoHaPosteadoFotos(){
    return <p className="text-center"> Este Usuario no ha posteado fotos.</p>
}
