import { useContext } from 'react';
import './header-login.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/authContext';

function HeaderLoginComponent() {
    
    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();
    
    const onLogout = () => {
        logout();
        localStorage.clear()
        navigate("/login", {
            replace: true,
        })
    }

    return (
        <>
            <section className="header-1">
                <div className="rectangle-5"></div>
                    <NavLink to="/">
                        <img className="capsule-corp-1" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/rkjsssf846yxwtd6dlpn" alt="Capsule Corp Logo" />
                    </NavLink>
                <span className='user-text'>Welcome back, {user && user.name}</span>
                <button className='log-in' onClick={onLogout}>
                    <div className="rectangle-2"></div>
                    <div className="log-in2">Log out</div>
                </button>
            </section>
        </>
    );
}

export default HeaderLoginComponent;