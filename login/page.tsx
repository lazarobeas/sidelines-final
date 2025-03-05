// This will be helpful when storing email and password
import {useState} from 'react'

// Need to export to allow other parts of program to use
// Default means this is the standard
export default function SignUp() {

    // React lets you create variable and function
    // to change the variable, already knows
    // it's a string
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Create variables to keep tracking if loading, a message
    // and any errors
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Create function to handle submited forms
    // It will take an event from HTML
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

        // Default event is to reload, so want to
        // prevent that
        event.preventDefault();

        // Set message, error, and loading to normal states
        setMessage('');
        setError('');
        setLoading(false);

        // Add supabase here

        // HTML for whenever we use this function
        return (
            <div>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        );
    }
}