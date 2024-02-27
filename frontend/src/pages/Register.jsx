import { useRef, useState, useEffect} from "react";
import { FaUser, FaCheck, FaTimes, FaInfoCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const NAME_REGEX = /^(?![\s.]+$)[a-zA-Z\s.]*.{4,30}$/;
const USER_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,24}$/;

function Register() {
  const { setAuth } = useAuth(); 
    const userRef = useRef();
    const errRef = useRef();

    // Form fields
    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [user, setUser] = useState('');
    const [validUser, setValidUser] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/'

    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
      userRef.current.focus()
    }, [])

    useEffect(() => {
      setErrMsg('');
    }, [name, user, pwd, matchPwd])

    useEffect(() => {
      setValidName(NAME_REGEX.test(name));
  }, [name])

    useEffect(() => {
      setValidUser(USER_REGEX.test(user));
  }, [user])

  useEffect(() => {
      setValidPwd(PWD_REGEX.test(pwd));
      setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])
    
    const onSubmit = async (e) => {
        e.preventDefault()
    
        try {

          if (!USER_REGEX.test(user) || !PWD_REGEX.test(pwd)) {
            setErrMsg("Invalid username or password")
            return;
          }

          const response = await axios.post('/users/',
                JSON.stringify({ 'name': name, 'email': user, 'password': pwd, 'isAdmin': false}),
                {
                  headers: { 'Content-Type': 'application/json' },
                  withCredentials: true
                }
          );
         
          setAuth({ ...response.data})
          window.sessionStorage.setItem('user', JSON.stringify(...response.data))
            setName('');
            setUser('');
            setPwd('');
            setMatchPwd('')
        
            navigate(from, { replace: true})
  
          } catch (error) {
            if (!error?.response) {
               setErrMsg('No Server Response')
            } else setErrMsg(error.response?.data?.message)
            
            errRef.current.focus();
          }
    }

    return <>
    <section className="heading">
        <h1>
            <FaUser /> Register
        </h1>
        <p>Please create an account</p>
    </section>
    
    <section className="form">
    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen" } 
        aria-live="assertive">{errMsg}</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="displayname">
            Display Name:
            <FaCheck className={validName ? "valid" : "hide"} />
            <FaTimes className={validName || !name ? "hide" : "invalid"} />
          </label>
            <div className="form-group">
                <input 
                type='text'
                className="form-control"
                id='displayname'
                ref={userRef}
                value={name}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="What should we call you?"
                aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                />
                <p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            4 to 30 characters.<br />
                            Must begin with a letter.<br />
                            Letters, periods, and spaces allowed.
                  </p>
            </div>
            <div className='form-group'>
            <label htmlFor="email">
                Email (this is your username):
                            <FaCheck className={validUser ? "valid" : "hide"} />
                            <FaTimes className={validUser || !user ? "hide" : "invalid"} />
            </label>
            <input
              type='email'
              className='form-control'
              id='email'
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
            />
            <p id="uidnote" className={userFocus && user && !validUser ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            A valid-looking email address
                        </p>
          </div>
          <div className='form-group'>
          <label htmlFor="password">
                            Password:
                            <FaCheck className={validPwd ? "valid" : "hide"} />
                            <FaTimes className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, and a number. 
                            </p>
          </div>
          <div className='form-group'>
          <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FaCheck className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FaTimes className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            Must match the first password input field.
                        </p>
          </div>
          <div className='form-group'>
          <button disabled={!validName || !validUser || !validPwd || !validMatch ? true : false}>
              Register Me!
            </button>
          </div>
        </form>
        <p>
                        Already registered?<br />
                        <span className="line">
                            <Link to="/Login">Sign In</Link>
                        </span>
                    </p>
        
    </section>
    </>
}

export default Register