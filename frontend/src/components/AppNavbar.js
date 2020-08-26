import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    navbarToggler,
    navbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container,
    NavbarBrand,
    NavbarToggler
} from 'reactstrap';

class AppNavbar extends Component {
    state = {
        isOpen: false
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="sm" className="mb-5">
                    <Container>
                        <NavbarBrand href="/">Haikus Online!</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink href="/haikus/today">Today's Haiku</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );

    }


}

export default AppNavbar;