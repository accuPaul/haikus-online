import { useState, useEffect, useRef} from "react";
import useAuth from '../hooks/useAuth'
import { Card, CardText, CardBody, CardHeader, Alert, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Nav from 'react-bootstrap/Nav'
import { FaThumbsUp, FaEdit, FaTrash, FaPlus, FaSortUp, FaSortDown } from 'react-icons/fa';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { loadSession } from "../components/loadSession";
import { addHaiku, deleteHaiku, editHaiku, getHaikuList, upVote } from "../actions/haikuActions";
import Pagination from 'react-bootstrap/Pagination'
import DeleteModal from '../components/DeleteModal'
import EditHaikuModal from "../components/EditHaikuModal";

const HaikuList = () => {
    const [ haikuList, setHaikuList ] = useState();
    const [ errorMessage, setErrorMessage ] = useState();
    const { auth, setAuth } = useAuth(() => loadSession('user'));
    const { source, sort } = useParams();
    const [ params, setParams ] = useState({
        source: useParams().source,
        sort: useParams().sort
    });
    const [ page, setPage] = useState(1);
    const [ pageSize, setPageSize ] = useState(20)
    const [ pageCount, setPageCount] = useState(1)
    const [ sortField, setSortField] = useState('dateAdded')
    const [ sortDir, setSortDir ] = useState(-1)
    
    const navigate = useNavigate();
    const location = useLocation();
    const errRef = useRef();
    const [ dialog, setDialog ] = useState({
        title: "",
        isLoading: false
    })
    const [ modal, setModal ] = useState({
        haiku: {
            id: null,
            title: '',
            line1: '',
            line2: '',
            line3: '',
            author: null,
            canScramble: false,
            visibleTo: 'public'
        },
        isLoading: false
    })
    const haikuIdRef = useRef();
    const userId = auth.id;

    useEffect(() => {
        setErrorMessage('')
    }, [])

    useEffect(() => {
        if (source !== 'myHaikus') {
            setSortField('')
            setSortDir()
        }
    }, [source, sort])

    async function getList() {
        await getHaikuList(params, page, pageSize, sortField, sortDir)
        .then(response => {
            if (response?.data?.haikus?.metadata) {
                const metadata = response.data.haikus.metadata
                if (metadata?.pageSize && metadata.pageSize !== pageSize) setPageSize(metadata.pageSize);
                if (metadata.page && metadata.page !== page) setPage(metadata.page)  
                if (metadata.totalCount) setPageCount((Math.floor(metadata.totalCount/pageSize))+1)
            }
    
            setHaikuList(response.data?.haikus?.data)
        })
        .catch(error => {
            console.log(`Error = ${JSON.stringify(error)}`)
            setErrorMessage(error.message)
            if (error.status === 401 || error.status === 401) {
                setAuth();
                window.sessionStorage.removeItem('user')
                navigate('/login', { state: { from: location}, replace: true})
            }
         })

    }

    const onUpVoteClick = async (haikuId) => {
        await upVote(haikuId)
            .then(res =>{
                const index = haikuList.indexOf((haiku) => haiku._id === haikuId)
                setHaikuList(haikuList.splice(index,1,res))
                }
            )
            .catch(err => {
                console.error(`Err response is ${JSON.stringify(err)}`)
                setErrorMessage(err.response?.data)
            }
            );

    }

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

    const handleNew = () => {
        const newHaiku = {
            title: '',
            line1: '',
            line2: '',
            line3: '',
            author: null,
            canScramble: false,
            visibleTo: 'public'
        }
        haikuIdRef.current = null;
        handleModal(newHaiku, true);
    }

    const handleEdit = (id) => {
        const haiku = haikuList.find((h) => h._id === id);
        console.log(`Haiku id ${id} chosen for edit ${JSON.stringify(haiku)}`)
        if (haiku) {
            haikuIdRef.current = id;
            const newHaiku = {
                title: haiku.title,
                line1: haiku.line1,
                line2: haiku.line2,
                line3: haiku.line3,
                canScramble: haiku.canScramble,
                visibleTo: haiku.visibleTo
            }
            handleModal(newHaiku, true)
        }
    }

    const handleModal = (haiku, isLoading) => {
        setModal({
            haiku,
            isLoading
        });
        console.log(`Modal = ${JSON.stringify(modal)}`)
    }

    const confirmEdit = async (newHaiku, choice) => {
        console.log(`New Haiku = ${JSON.stringify(newHaiku)}`)
        if (choice) {
            if (haikuIdRef.current !== null) {
                delete newHaiku._id;
                await editHaiku(haikuIdRef.current, newHaiku)
                .then(res => {
                    const index = haikuList.indexOf(haiku => haiku._id === haikuIdRef.current)
                    setHaikuList(haikuList.splice(index,1,res.data))
                })
                .catch(err => {
                    setErrorMessage(err.response?.data?.msg)
                })

            } else {
                newHaiku.author = userId;
                await addHaiku(newHaiku)
                .then(res => {
                    navigate('/myHaikus/all',  { replace: true});
                })
                .catch(err =>
                    setErrorMessage(err.response?.data?.msg)
                );
            }
            handleModal("", false)
        haikuIdRef.current = null;
        } else {
            handleModal("", false)
            haikuIdRef.current = null;
        }
    }

    useEffect(() => {   
        getList();
    }, [page, sortField, sortDir])

   
    return (
        <article className="mt-3">
        <Alert variant="danger" show={errorMessage}>
        <p ref={errRef} aria-live="assertive">{errorMessage}</p>
        </Alert>
        <Alert variant="success" show={auth.token !== undefined}>
            <div className="text-center">
            <Button className="me-2" onClick={(e) => handleNew(e)}><FaPlus /> Add a haiku</Button>
            </div>
        </Alert>
        { sort 
        ?
        <Container justify>
        <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
        <Pagination className="me-2">
            <Pagination.First 
                disabled={page === 1}
                onClick={() => setPage(1)} />
            <Pagination.Prev className="me-3"
            disabled={page === 1}
            onClick={() => setPage(page-1)} />
            {page > 2 ? <Pagination.Ellipsis disabled /> : <></> }
            {page > 1 ? 
                <Pagination.Item
                onClick={() => setPage(page-1)}>{page-1}
                </Pagination.Item> 
                : <></> }
            <Pagination.Item active>{page}</Pagination.Item>
            {page < (pageCount) ? 
                <Pagination.Item
                onClick={() => setPage(page+1)}>{page+1}
                </Pagination.Item> 
                : <></> }
            {page === 1 && pageCount >= 3 ? 
                <Pagination.Item
                onClick={() => setPage(3)}>3
                </Pagination.Item> 
                : <></> }
            {page < pageCount ? <Pagination.Ellipsis disabled /> : <></> }
            <Pagination.Next className="ms-3" disabled={page === pageCount}
            onClick={() => setPage(page+1)} />
            <Pagination.Last  
                disabled={page === pageCount}
                onClick={() => setPage(pageCount)} />
        </Pagination>
        { source === 'myHaikus' 
        ?
        <Nav variant='pills' activeKey={sortField==='dateAdded'?'by-date':'by-likes'}>
            <Nav.Item>
                <Nav.Link disabled>
                    Sort Options:
                </Nav.Link>
            </Nav.Item>
            <Nav.Item eventKey="by-date">
                <Nav.Link onClick={() => setSortField('dateAdded')}>
                    Date<button onClick={() => setSortDir(prev => { return prev * -1})} disabled={sortField==='nLikes'}>
                    {sortDir > 0 ? <FaSortUp />: <FaSortDown />}
                    </button>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item eventKey="by-likes">
                <Nav.Link onClick={() => setSortField('nLikes')}>
                    Likes<button onClick={() => setSortDir(prev => { return prev * -1})} disabled={sortField==='dateAdded'}>
                        {sortDir > 0 ? <FaSortUp />: <FaSortDown />}</button>
                </Nav.Link>
            </Nav.Item>
        </Nav>
        : <></>}
        </ButtonToolbar>
        </Container>
        :
        <></>}
        
                {haikuList?.length ? (
                    <Row xs={1} md={2} className="g-4">
                    {haikuList.map(({ ...haiku }, idx) => (
                        <Col key={idx}>
                            <Card border={haiku.author === userId?'success':'dark'}>
                                    <CardHeader tag="h4">{haiku.title}</CardHeader>
                                    <CardBody>
                                        <CardText>
                                            <blockquote className="blockquote mb-0">
                                                {haiku.line1}<br />
                                                {haiku.line2}<br />
                                                {haiku.line3}
                                            </blockquote>
                                            <footer className="blockquote-footer text-end">
                                                    <cite>{haiku.authorName?haiku.authorName:'anonymous'}</cite>
                                                </footer>
                                        </CardText>
                                        <Nav justify>
                                            <Nav.Item>
                                            <button
                                                className="upVote-btn me-2"
                                                color="primary"
                                                name="liked"
                                                value={haiku._id}
                                                onClick={() => onUpVoteClick(haiku._id)}
                                                disabled={!auth?.token || haiku.likers?.includes(userId)}
                                            >
                                                <FaThumbsUp fill="blue" stroke="white"/>{' '} </button>
                                            {haiku.nLikes? haiku.nLikes : 0} {haiku.nLikes === 1 ? ' reader' : ' readers'} liked this  
                                            </Nav.Item>
                                            <Nav.Item>
                                                {haiku.author === userId ? 
                                                <button
                                                color="primary"
                                                name="edit"
                                                value={this}
                                                disabled={haiku.author !== userId}
                                                onClick={() => handleEdit(haiku._id)}
                                                aria-label="Edit this haiku">
                                                <FaEdit />
                                                </button> 
                                                : 
                                                <></>
                                                }
                                            </Nav.Item>
                                            <Nav.Item>
                                                { haiku.author === userId || auth?.isAdmin
                                                ?
                                                    <button color="primary"
                                                    name="delete"
                                                    value={this}
                                                    disabled={haiku.author !== userId && !auth?.isAdmin}
                                                    onClick={() => handleDelete(haiku._id)}
                                                    aria-label="Delete this haiku">
                                                    <FaTrash color="red" />
                                                    </button>
                                                :
                                                <></>
                                                }
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
                    {modal.isLoading && (
                        <EditHaikuModal 
                            haiku={modal.haiku} 
                            onModal={confirmEdit}
                            isLoading={modal.isLoading} />
                    )}
                    </Row>
                ) :
                <p>No Haikus to display</p>
                }
        </article>
    )
}

export default HaikuList;