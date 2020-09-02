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
                <NavItem>
                    <strong>{user ? `Welcome ${user.name}` : ''}</strong>
                </NavItem>
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
                <Navbar color="faded" light expand="sm" className="mb-5">
                    <Container>
                        <NavbarBrand href="/">Haikus Online!</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                {isAuthenticated ? authLinks : guestLinks}
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Options
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            {isAuthenticated ?
                                                <NavLink href="/myHaikus" className="text-italic">my Haikus</NavLink>
                                                : null}
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <p className="ml-3">Public Haikus</p>
                                        <DropdownItem>
                                            <NavLink to={{
                                                pathname: '/list',
                                                listProps: {
                                                    source: 'haikus',
                                                    sort: 'recent'
                                                }
                                            }}>Most Recent</NavLink>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <NavLink to={{
                                                pathname: '/list',
                                                listProps: {
                                                    source: 'haikus',
                                                    sort: 'popular'
                                                }
                                            }}>Most Popular</NavLink>
                                        </DropdownItem>
                                        <p className="ml-3">Scramble-Ku!</p>
                                        <DropdownItem>
                                            <NavLink to={{
                                                pathname: '/list',
                                                listProps: {
                                                    source: 'scramble',
                                                    sort: 'recent'
                                                }
                                            }}>Most Recent</NavLink>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <NavLink to={{
                                                pathname: '/list',
                                                listProps: {
                                                    source: 'scramble',
                                                    sort: 'popular'
                                                }
                                            }}>Most Popular</NavLink>
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>
                                            {isAuthenticated ? <Logout /> : null}
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
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