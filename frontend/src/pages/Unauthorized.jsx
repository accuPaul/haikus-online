import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section>
            <h1>Unauthorized</h1>
            <p>You do not have access to the requested page</p>
            <div className="flexGrow">
                <button onClick={goBack}>
                    <FaArrowLeft /> Go Back
                </button>
            </div>
        </section>
    )
}

export default Unauthorized;