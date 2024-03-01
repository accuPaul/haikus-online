import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation} from "react-router-dom"
import useAuth from "../hooks/useAuth"
import axios from "axios";
import { FaSignInAlt } from "react-icons/fa";
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'

function Login() {
    const { setAuth, persist, setPersist } = useAuth(); 
    const userRef = useRef();
    const errRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/'

    const [errMsg, setErrMsg] = useState('')
   
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const { email, password } = formData
    
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
      setErrMsg('');
    }, [formData.email, formData.password])

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/auth',
              JSON.stringify(formData),
              {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
              }
            );

        setAuth({ ...response.data})
        window.sessionStorage.setItem('user', JSON.stringify(response.data))
          setFormData({ email: '', password: '' })
      
          navigate(from, { replace: true})

        } catch (error) {
          console.log(`Error = ${error}`)
          if (!error?.response) {
             setErrMsg('No Server Response')
          } else setErrMsg('Invalid username or password')
          
          errRef.current.focus();
        }

    }

    const togglePersist = () => {
        setPersist(prev => !prev)
    }

    useEffect(() => {
      localStorage.setItem("persist", persist)
    }, [persist])

    return <>
    <section className="heading text-center" style={{ width: '30rem'}}>
      <Card>
        <Card.Header as="h1">
          <FaSignInAlt /> Please Log In
        </Card.Header>
        <Card.Body>
        <section className="form">
        <form onSubmit={onSubmit}>
            <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              ref={userRef}
              autoComplete="off"
              placeholder='Enter your email'
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
              required
            />
          </div>
          
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Sign In
            </button>
          </div>
          <Form.Check
           type="switch"
           id="persist-switch"
           label="Trust this device"
           className="fs-5"
           onChange={togglePersist} 
           checked={persist} />
        </form>
        </section>

        <p className="fs-6">
          Not registered?{' '}
          <span className="line">
              <Link to="/Register">Register Now!</Link>
          </span>
        </p>
    
        </Card.Body>
        <Card.Footer ref={errRef} className={errMsg ? "errmsg" : "offscreen" } >
          {errMsg}
        </Card.Footer>
      </Card>
    </section>
    </>
}

export default Login