import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteModal({ title, onDialog }) {
    console.log(`title = ${title}\t onDialog = ${onDialog}`)
  return (
      <Modal 
        show={title?.length} 
        centered>
        <Modal.Header>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete haiku: {title}?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => onDialog(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => onDialog(true)}>Delete</Button>
        </Modal.Footer>
      </Modal>
  );
}

export default DeleteModal;