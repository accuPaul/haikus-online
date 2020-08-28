import React, { Component, Fragment } from 'react';
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
    NavbarToggler,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Dropdown
} from 'reactstrap';
import RegisterModal from './auth/registerModal';
import LoginModal from './auth/loginModal';
import Logout from './auth/logout';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import haikuModal from './HaikuModal';

class AppNavbar extends Component {
    state = {
        isOpen: false
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const authLinks = (
            <Fragment>
                <UncontrolledDropdown>
                    <DropdownToggle new caret>
                        <strong>{user ? `Welcome ${user.name}` : ''}</strong>
                    </DropdownToggle>
                    <DropdownMenu right className="ml-auto">
                        <DropdownItem>
                            <NavLink href="#">my Haikus</NavLink>
                        </DropdownItem>
                        <DropdownItem>
                            <haikuModal />
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>
                            <Logout />
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <RegisterModal />
                </NavItem>
                <NavItem>
                    <LoginModal />
                </NavItem>
            </Fragment>
        );

        return (
            <div>
                <Navbar color="dark" dark expand="sm" className="mb-5">
                    <Container>
                        <NavbarBrand href="/">Haikus Online!</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                {isAuthenticated ? authLinks : guestLinks}
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );

    }


}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(AppNavbar);