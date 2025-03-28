import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.css";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    console.error("No user found in localStorage");
    return <div>Please log in again!</div>;
  }

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (message) => newRequest.post(`/messages`, message),
    onSuccess: () => {
      alert("Message sent successfully!");
      queryClient.invalidateQueries(["messages", id]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target[0].value.trim();
    if (!message) {
      alert("Message cannot be empty!");
      return;
    }
    mutation.mutate({
      conversationId: id,
      desc: message,
    });
    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link> &gt; John Doe &gt;
        </span>
        {isLoading ? (
          "Loading..."
        ) : error ? (
          <div>Error: {error.message || "Something went wrong!"}</div>
        ) : (
          <div className="messages">
            {data.map((m) => (
              <div
                className={m.userId === currentUser._id ? "owner item" : "item"}
                key={m._id}
              >
                <img
                  src={m.userAvatar || "/default-avatar.png"}
                  alt="User Avatar"
                />
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="Write a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
