import React, { useState } from 'react';
import axios from 'axios';

const SendMessageForm = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [senderId, setSenderId] = useState('');
    const [senderUsername, setSenderSenderUsername] = useState('');
    const [senderRole, setSenderRole] = useState('');
    const [responseMessage, setResponseMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResponseMessage(null);

        try {
            const payload = {
                title,
                message,
                senderId: parseInt(senderId), // Ensure senderId is a number
                senderUsername,
                senderRole
            };
            const response = await axios.post('/api/notifications/send-to-admin', payload);
            setResponseMessage('Message sent successfully!');
            setTitle('');
            setMessage('');
            // Optionally clear sender fields if they are static or fetched from context
            // setSenderId('');
            // setSenderUsername('');
            // setSenderRole('');
        } catch (err) {
            console.error('Error sending message:', err.response ? err.response.data : err.message);
            setError('Failed to send message: ' + (err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Unknown error'));
        }
    };

    return (
        <div className="send-message-form">
            <h2>Send Message to Administrators</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input 
                        type="text" 
                        id="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea 
                        id="message" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        required 
                    ></textarea>
                </div>
                {/* These fields would typically come from user context/authentication */}
                <div className="form-group">
                    <label htmlFor="senderId">Your ID:</label>
                    <input 
                        type="number" 
                        id="senderId" 
                        value={senderId} 
                        onChange={(e) => setSenderId(e.target.value)} 
                        placeholder="e.g., 123" 
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senderUsername">Your Username:</label>
                    <input 
                        type="text" 
                        id="senderUsername" 
                        value={senderUsername} 
                        onChange={(e) => setSenderSenderUsername(e.target.value)} 
                        placeholder="e.g., user123" 
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senderRole">Your Role:</label>
                    <input 
                        type="text" 
                        id="senderRole" 
                        value={senderRole} 
                        onChange={(e) => setSenderRole(e.target.value)} 
                        placeholder="e.g., manager" 
                        required
                    />
                </div>
                <button type="submit" className="send-btn">Send Message</button>
            </form>
            {responseMessage && <p className="success-message">{responseMessage}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default SendMessageForm; 