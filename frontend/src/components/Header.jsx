import {FaSignInAlt,FaSignOutAlt, FaUser, FaUserPlus} from 'react-icons/fa'
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Nav from 'react-bootstrap/Nav';
import NavLink from 'react-bootstrap/NavLink'
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { loadSession } from './loadSession';
import { DropdownItem } from 'react-bootstrap';


function Header() {
    const { setAuth, auth } = useAuth(() => loadSession('user'));

    const logout = async () => {
        window.sessionStorage.removeItem('user');
        setAuth({});
        <Navigate to='/' replace />
    }

    return (
                <Nav justify color="faded" className="bg-body-tertiary">
                        <Navbar.Brand href="/">Haikus Online!</Navbar.Brand>
                        <Nav.Item className='text-end'>
                            <Dropdown align="end">
                            {auth.token ?
                            <div>
                                <Dropdown.Toggle as={NavLink}>
                                Welcome, {auth.name}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <NavLink as={DropdownItem} href="/">Profile</NavLink>
                                <Dropdown.Item>
                                    <button onClick={logout}><FaSignOutAlt /> Logout</button>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                            </div>
                               : 
                               <div>
                                <Dropdown.Toggle as={NavLink}>
                                    Options
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <NavLink as={DropdownItem} href="/login">
                                        <FaSignInAlt /> Login
                                    </NavLink>
                                    <NavLink as={DropdownItem} href="/register">
                                        <FaUserPlus /> Register
                                    </NavLink>
                                </Dropdown.Menu>
                                </div> }
                        </Dropdown>
                        </Nav.Item>
                </Nav>
    )
}

export default Header