import React, {useState} from 'react';
import Main from "../Componentes/Main";
import imageSignup from '../imagenes/signup.png'
import {Link } from 'react-router-dom';
export default function Signup({signup}) {

    const [usuario, setUsuario] = useState({
        email: '',
        username: '',
        password: '',
        bio: '',
        nombre: ''
    });


    /**
     * Cuando cambia un valor en el formulario
     * @param e
     */
    function handleInputChange(e) {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    }

    /**
     * Cuando se envie el formulario
     * llamamos esta funcion
     * Asincrona
     * @param e
     */
    async function handleSubmit(e) {
        e.preventDefault();
        try {
           await signup(usuario);
            // const {data} = await Axios.post('/api/usuarios/signup', usuario);
            // console.log(data);

        } catch (error) {
            console.log(error);
        }

    }


    return (
        <Main center={true}>
            <div className="Signup">
                <img src={imageSignup} alt="" className="Signup__img"/>

                {/*    Formulario*/}
                <div className="FormContainer">
                    <h1 className="Form__titulo">Instagram</h1>
                    <p className="FormContainer__info">
                        Regístrate para que veas el clon de Instagram
                    </p>
                    <form onSubmit={handleSubmit}
                    >
                        <input type="email" name="email" required className="Form__field" placeholder="Email"
                               onChange={handleInputChange}
                               value={usuario.email}
                        />
                        <input type="text" name="nombre" required className="Form__field"
                               placeholder="Nombre y Apellido"
                               minLength="3" maxLength="100"
                               onChange={handleInputChange}
                               value={usuario.nombre}
                        />
                        <input type="text" name="username" required className="Form__field" placeholder="Username"
                               minLength="3" maxLength="30"
                               onChange={handleInputChange}
                               value={usuario.username}
                        />
                        <input type="text" name="bio" required className="Form__field" placeholder="Cuéntanos de ti..."
                               minLength="3" maxLength="100"
                               onChange={handleInputChange}
                               value={usuario.bio}
                        />
                        <input type="password" name="password" required className="Form__field"
                               onChange={handleInputChange}
                               value={usuario.password}
                               placeholder="Contraseña"/>
                        <button className="Form__submit" type="submit"> Sign Up</button>
                        <p className="FormContainer__info"> Ya tienes cuenta? <Link to="/login">Login</Link></p>
                    </form>
                </div>
            </div>
        </Main>

    )
}