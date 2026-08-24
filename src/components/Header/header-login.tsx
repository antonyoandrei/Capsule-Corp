import { useContext } from 'react';
import './header-login.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/authContext';
import capsuleCorpLogo from '../../../capsule-corp-seeklogo.svg';

function HeaderLoginComponent() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const onLogout = () => {
        logout();
        navigate("/login", {
            replace: true,
        })
    }

    return (
        <header className="header-1">
            <div className="user-text">
                <span>Signed in as</span>
                <strong>{user?.name}</strong>
            </div>
            <NavLink className="store-brand" to="/homepage" aria-label="Capsule Corp home">
                <img className="capsule-corp-1" src={capsuleCorpLogo} alt="Capsule Corp" />
            </NavLink>
            <button className="log-in" onClick={onLogout} type="button">
                <span>Log out</span>
                <span aria-hidden="true">↗</span>
            </button>
        </header>
    );
}

export default HeaderLoginComponent;
