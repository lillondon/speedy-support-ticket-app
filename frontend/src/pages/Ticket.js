import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTicket, closeTicket } from "../features/ticket/ticketSlice";
import { toast } from "react-toastify";
import Modal from "react-modal";
import BackButton from "../components/BackButton";
import NoteItem from "../components/NoteItem";
import Spinner from "../components/Spinner";
import { getNotes, reset as noteReset } from "../features/notes/noteSlice";

const customStyle = {
	content: {
		width: "600px",
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%,-50%)",
		position: "relative",
	},
};

Modal.setAppElement("#root");

function Ticket() {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [noteText, setNoteText] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();
	const { ticket, isError, message, isLoading } = useSelector((state) => state.ticket);
	const { notes, isSuccess, isLoading: notesIsLoading } = useSelector((state) => state.notes);

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}
		dispatch(getTicket(params.ticketId));
		dispatch(getNotes(params.ticketId));
	}, [params.ticketId]);

	const onTicketClose = () => {
		dispatch(closeTicket(params.ticketId));
		toast.success("Ticket Closed");
		navigate("/tickets");
	};

	if (isLoading || notesIsLoading) {
		return <Spinner />;
	}
	if (isError) {
		return <h2>Sorry, but something went wrong. Our team is working on the problem!</h2>;
	}

	return (
		<div className="ticket-page">
			<header className="ticket-header">
				<BackButton url="/tickets" />
				<h2>
					Ticket ID: {ticket._id}
					<span className={`status status-${ticket.status}`}>{ticket.status}</span>
				</h2>
				<h3>Date Submitted: {new Date(ticket.createdAt).toLocaleString("en-IE")}</h3>
				<h3>Product: {ticket.product}</h3>
				<hr />
				<div className="ticket-desc">
					<h3>Issue Description:</h3>
					<p>{ticket.description}</p>
				</div>
				<h2>Notes</h2>
			</header>
			{notes.map((note) => (
				<NoteItem key={note._id} note={note} />
			))}
			{ticket.status !== "closed" && (
				<button className="btn btn-block btn-danger " onClick={onTicketClose}>
					Close Ticket
				</button>
			)}
		</div>
	);
}

export default Ticket;
