import { useState, useEffect,useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserList } from "../actions/userActions";
import Table from 'react-bootstrap/Table'
import { FaTrash,FaEdit,FaUsers } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import FormCheck  from "react-bootstrap/FormCheck";

const Users = () => {
    const [users, setUsers] = useState();
    const [errMsg, setErrMsg] = useState('')
    const errRef = useRef();
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=> async () => {
        let isMounted = true;
        const controller = new AbortController();

        try {
            const response = await getUserList();

            isMounted && setUsers(response.data)
        } catch (error) {
            console.error(`error = ${JSON.stringify(error)}`)
            if (error?.status === 401 || error?.status === 403)
                navigate('/login', { state: { from: location}, replace: true})
            else
                setErrMsg(error?.message)

        }
        
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [location, navigate])

    return (
        <article>
                <section className="heading text-center">
    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen" } 
        aria-live="assertive">{errMsg}</p>
        <h1>
            <FaUsers /> User List
        </h1>
    </section>
            {users?.length
                ? (
                    <Table responsive>
                        <thead>
                            <tr>
                            <th>Display Name</th>
                            <th>Login Email</th>
                            <th>Admin?</th>
                            <th>Modify</th>
                            <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        {users.map((user, i) => (
                            <tr key={i}>
                                <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td><FormCheck 
                               type='checkbox' 
                               id={`admin-${user._id}`}
                                defaultChecked={user.isAdmin} />
                            </td>
                            <td>
                                <Button>
                                    <FaEdit />
                                </Button>
                            </td>
                            <td>
                                <Button>
                                    <FaTrash />
                                </Button>
                            </td>
                            </tr>
                        ))}

                        </tbody>
                    </Table>
                ) : <p>No users to display</p>
            }
        </article>
    );
};

export default Users;