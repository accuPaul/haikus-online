import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import useAuth from '../hooks/useAuth'
import { FaUser,FaUsers } from 'react-icons/fa';
import { useState } from 'react';
import { loadSession } from './loadSession';

const Navigation = () => {
    const { auth } = useAuth(() => loadSession('user'));
    const [active, setActive] = useState('today');

    return(
    <Nav variant='tabs' activeKey={active} onSelect={(selectKey) => setActive(selectKey)}>
        <Nav.Item eventKey="today">
            <Nav.Link href="/">Today</Nav.Link>
        </Nav.Item>
        {auth?.token? 
        <Nav.Item eventKey="my-haikus">
            <Nav.Link href="/myHaikus/all">
            <FaUser /> my Haikus
            </Nav.Link>
        </Nav.Item>
        : ''}
        <Nav.Item eventKey="public">
        <Dropdown>
        <Dropdown.Toggle as={NavLink}>Public Haikus</Dropdown.Toggle>
        <Dropdown.Menu>
            <NavLink as={Dropdown.Item} href="/haikus/recent">Recent</NavLink>
            <NavLink as={Dropdown.Item} href="/haikus/popular">Popular</NavLink>
        </Dropdown.Menu>
        </Dropdown>
        </Nav.Item>
        <Nav.Item eventKey="scramble">
        <Dropdown>
        <Dropdown.Toggle as={NavLink} disabled={!auth.token}>Scramble-ku!</Dropdown.Toggle>
        <Dropdown.Menu>
            <NavLink as={Dropdown.Item} href="/scramble/recent">Recent</NavLink>
            <NavLink as={Dropdown.Item} href="/scramble/popular">popular</NavLink>
        </Dropdown.Menu>
        </Dropdown> 
        </Nav.Item>
        
        {auth?.isAdmin?
        <Nav.Item eventKey="users">
            <Nav.Link href='/users'>
                <FaUsers /> Manage Users
            </Nav.Link>
        </Nav.Item>
        : ''}
    </Nav>
    )
}

export default Navigation;