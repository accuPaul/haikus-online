import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { FaInfoCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const TITLE_REGEX = /^(?![\s.]+$)[a-zA-Z0-9\s.]*.{0,50}$/;
const LINE_REGEX = /^(?=.*[a-z._-])(?=.*[A-Z]).{10,70}$/;


function EditHaikuModal({ haiku, onModal, isLoading}) {
    const [ newHaiku, setNewHaiku ] = useState(haiku)

    // Form fields
    const [validTitle, setValidTitle] = useState(false);
    const [titleFocus, setTitleFocus] = useState(false);

    const [validLine1, setValidLine1] = useState(false);
    const [line1Focus, setLine1Focus] = useState(false);

    const [validLine2, setValidLine2] = useState(false);
    const [line2Focus, setLine2Focus] = useState(false);

    const [validLine3, setValidLine3] = useState(false);
    const [line3Focus, setLine3Focus] = useState(false);

    const visibililtyOptions = [
        { value: "public", label: 'Public (anyone can see it)' },
        { value: "private", label: 'Private (only you can see it)'},
        { value: "anonymous", label: 'Anonymous (public, but no names are listed)'}
    ]

    useEffect(() => {
        setValidTitle(TITLE_REGEX.test(newHaiku.title));
    }, [newHaiku.title])
  
    useEffect(() => {
        setValidLine1(LINE_REGEX.test(newHaiku.line1));
        setValidLine2(newHaiku.line1 !== newHaiku.line2 && newHaiku.line3 !== newHaiku.line2)
    }, [newHaiku.line1, newHaiku.line2, newHaiku.line3])

    useEffect(() => {
        setValidLine2(LINE_REGEX.test(newHaiku.line2));
    }, [newHaiku.line2])

    useEffect(() => {
        setValidLine3(LINE_REGEX.test(newHaiku.line3));
        setValidLine2(newHaiku.line1 !== newHaiku.line2 && newHaiku.line3 !== newHaiku.line2)
    }, [newHaiku.line3, newHaiku.line2, newHaiku.line1])

    return (
        <Modal 
        centered
        show={isLoading}>
        <Modal.Header>
          <Modal.Title>{newHaiku?.id? 'Edit Haiku' : 'Write New Haiku'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        type='text' 
                        placeholder='(Untitled)' 
                        value={newHaiku.title}
                        onChange={(e) => setNewHaiku(prev => { return {...prev, title: e.target.value} })} 
                        aria-invalid={validTitle ? "false" : "true"}
                            aria-describedby="titlenote"
                            onFocus={() => setTitleFocus(true)}
                            onBlur={() => setTitleFocus(false)}
                />
                <p id="titlenote" className={titleFocus && newHaiku.title && !validTitle ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            1 to 50 characters (or blank for untitled).<br />
                            Letters, periods, and spaces allowed.
                  </p>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Three lines, 5-7-5...</Form.Label>
                    <Form.Control 
                        type='text' 
                        placeholder='Five syllables here' 
                        value={newHaiku.line1}
                        onChange={(e) => setNewHaiku(prev => { return {...prev, line1: e.target.value}})} 
                        aria-invalid={validLine1 ? "false" : "true"}
                            aria-describedby="line1note"
                            onFocus={() => setLine1Focus(true)}
                            onBlur={() => setLine1Focus(false)}
                />
                <p id="line1note" className={line1Focus && newHaiku.line1 && !validLine1 ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            10 to 50 characters.<br />
                            Letters, periods, and spaces allowed.
                  </p>
                </Form.Group>
                <Form.Group>
                    <Form.Control 
                        type='text' 
                        placeholder='Seven syllables for line 2' 
                        value={newHaiku.line2}
                        onChange={(e) => setNewHaiku(prev => { return {...prev,line2: e.target.value} })} 
                        aria-invalid={validLine2 ? "false" : "true"}
                            aria-describedby="line2note"
                            onFocus={() => setLine2Focus(true)}
                            onBlur={() => setLine2Focus(false)}
                />
                <p id="line2note" className={line2Focus && newHaiku.line2 && !validLine2 ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            10 to 70 characters.<br />
                            Letters, periods, and spaces allowed.
                  </p>
                </Form.Group>
                <Form.Group>
                    <Form.Control 
                        type='text' 
                        placeholder='Five syllables again' 
                        value={newHaiku.line3}
                        onChange={(e) => setNewHaiku(prev => { return {...prev,  line3: e.target.value}})} 
                        aria-invalid={validLine3 ? "false" : "true"}
                            aria-describedby="line3note"
                            onFocus={() => setLine3Focus(true)}
                            onBlur={() => setLine3Focus(false)}
                />
                <p id="line3note" className={line3Focus && newHaiku.line3 && !validLine3 ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            10 to 50 characters.<br />
                            Letters, periods, and spaces allowed.
                  </p>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Choose Privacy for this haiku</Form.Label>
                    <Form.Select 
                        options={visibililtyOptions}
                        defaultValue={newHaiku.visibleTo} 
                        onChange={(e) => setNewHaiku(prev => { return {...prev, visibleTo: e.target.value}})}>
                            <option value="public">Public (anyone can see it)</option>
                            <option value="private">Private (only you can see it)</option>
                            <option value="anonymous">Anonymous (public, but no names are listed)</option>
                        </Form.Select>
                </Form.Group>
                <Form.Check 
                    type='checkbox' 
                    label='Allow scramble?' 
                    name="canScramble"
                    defaultChecked={newHaiku.canScramble}
                    onChange={(e) => setNewHaiku(prev => { return {...prev, canScramble: e.target.checked}})}
                    /> 
            </Form>
          
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => onModal(newHaiku, false)}>Cancel</Button>
          <Button variant="danger" onClick={() => onModal(newHaiku, true)}>Save</Button>
        </Modal.Footer>
      </Modal> 
    )

}

export default EditHaikuModal;