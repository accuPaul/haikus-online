import { useState, useEffect, useCallback, useRef } from "react";
import useAuth from '../hooks/useAuth'
import { Button, Card, CardText, CardBody, CardHeader, Alert } from 'react-bootstrap';
import { FaThumbsUp, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"
import { loadSession } from "../components/loadSession";
import { deleteHaiku, upVote } from "../actions/haikuActions";
import Nav from 'react-bootstrap/Nav'
import DeleteModal from '../components/DeleteModal'

const HaikuList = () => {
    const [ haikuList, setHaikuList ] = useState();
    const [ errorMessage, setErrorMessage ] = useState();
    const { auth, setAuth } = useAuth(() => loadSession('user'));
    const { source, sort } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const errRef = useRef();
    const [ dialog, setDialog ] = useState({
        title: "",
        isLoading: false
    })
    const haikuIdRef = useRef();

    const handleDialog = (title, isLoading) => {
        setDialog({
            title,
            isLoading
        });
    };

    const handleDelete = (id) => {
        const index = haikuList.findIndex((h) => h._id === id);

        const title = haikuList[index]?.title || '(Untitled)'

        handleDialog(title, true)
        haikuIdRef.current = id;
    }

    const confirmDelete = (choice) => {
        if (choice) {
            setHaikuList(haikuList.filter((haiku) => haiku._id !== haikuIdRef.current))
            deleteHaiku(haikuIdRef.current).catch(err => setErrorMessage(err.response.data))
            handleDialog("", false)
        haikuIdRef.current = null;
        } else {
            handleDialog("", false)
            haikuIdRef.current = null;
        }
    }

    useEffect(() => {
        setErrorMessage('')
    }, [])

    const userId = auth.id;

    const getHaikuList = useCallback( async () => {
        let isMounted = true;
        const controller = new AbortController();
        const savedUser = loadSession('user')

        const config = {
            headers: {
                "Content-type": "application/json"
            }
        };
        if (savedUser?.token) config.headers['x-auth-token'] = savedUser.token;

        try {
            let params = ""
            if (source == null && sort == null) 
                params = "haikus/today"
            else if (source === 'myHaikus') {
                params = "haikus/user/"+savedUser.id
            } else {
                params = source + "/"+ sort
            }
            const response = await axios.get("/"+params, config, {
                signal: controller.signal,
            });
    
            isMounted && setHaikuList(response.data)
        } catch (error) {
            setErrorMessage(error.message)
            navigate('/login', { state: { from: location}, replace: true})
        }

        return () => {
            isMounted = false;
            controller.abort();
        }

    })
    
    useEffect(() => {
        getHaikuList()
    }, [])

    const onUpVoteClick = async (e, haikuId) => {
        await upVote(haikuId)
            .then(res =>{
                const index = haikuList.indexOf((haiku) => haiku._id === haikuId)
                if (index) {haikuList.splice(index, 1, res) }
                }
            )
            .catch(err => {
                console.error(`Err response is ${JSON.stringify(err)}`)
                setErrorMessage(err.response?.data)
            }
            );

    }

    return (
        <article className="mt-3">
        <Alert variant="danger" show={errorMessage}>
        <p ref={errRef} aria-live="assertive">{errorMessage}</p>
        </Alert>
        <Alert variant="success" show={auth.token !== undefined}>
            <div className="text-center">
            <Button className="me-2"><FaPlus /> Add a haiku</Button>
            </div>
        </Alert>
                {haikuList?.length ? (
                    <Row xs={1} md={2} className="g-4">
                    {haikuList.map(({ _id, title, line1, line2, line3, likers, authorName, author }, idx) => (
                        <Col key={idx}>
                            <Card border={author === userId?'success':'dark'}>
                                    <CardHeader tag="h4">{title}</CardHeader>
                                    <CardBody>
                                        <CardText>
                                            <blockquote className="blockquote mb-0">
                                                {line1}<br />
                                                {line2}<br />
                                                {line3}
                                            </blockquote>
                                            <footer className="blockquote-footer text-end">
                                                    <cite>{authorName?authorName:'anonymous'}</cite>
                                                </footer>
                                        </CardText>
                                        <Nav justify>
                                            <Nav.Item>
                                            <Button
                                                className="upVote-btn"
                                                color="primary"
                                                name="liked"
                                                value={_id}
                                                onClick={(e) => onUpVoteClick(e, _id)}
                                                disabled={!auth?.token || likers?.includes(userId)}
                                            >
                                                <FaThumbsUp strokeOpacity={'100%'}/>{' '} </Button>
                                            {likers?.length? likers.length : 0} {likers?.length === 1 ? 'reader' : 'readers'} liked this  
                                            </Nav.Item>
                                            <Nav.Item>
                                                    <Button
                                                        color="primary"
                                                        name="edit"
                                                        value={this}
                                                        disabled={author !== userId}>
                                                        <FaEdit />
                                                    </Button> Edit this haiku
                                            </Nav.Item>
                                            <Nav.Item className="text-center">
                                                <Button color="primary"
                                                        name="delete"
                                                        value={this}
                                                        disabled={author !== userId && !auth?.isAdmin}
                                                        onClick={() => handleDelete(_id)}>
                                                    <FaTrash color="red" />
                                                </Button> Delete this haiku
                                            </Nav.Item>
                                        </Nav>                       
                                    </CardBody>
                                </Card>
                        </Col>          
                    ))}
                    {dialog.isLoading && (
                        <DeleteModal 
                        title={dialog.title}
                        onDialog={confirmDelete}
                        />
                    )}
                    </Row>
                ) :
                <p>No Haikus to display</p>
                }
        </article>
    )
}

export default HaikuList;