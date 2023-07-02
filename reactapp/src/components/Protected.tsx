import { Component } from "react";

interface ProtectedProps {
}

interface ProtectedState {
    result: string;
    authenticated: boolean;
    loading: boolean;
    error: string | null;
}

export class Protected extends Component<ProtectedProps, ProtectedState> {
    constructor(props: ProtectedProps) {
        super(props);
        this.state = {
            result: "",
            authenticated: true,
            loading: true,
            error: null,
        }
    }

    render() {
        let response: string;

        if (!this.state.authenticated) {
            window.location.href = `/login?returnTo=${encodeURI(window.location.href)}`;
            return <></>;
        }

        if (this.state.loading) {
            response = "Loading...";
        } else if (this.state.error) {
            response = this.state.error;
        } else {
            response = `API response: ${this.state.result}`;
        }

        return <div>
            <h1>Page that requires authenticated user.</h1>
            <p>If you are not logged in, I'll redirect you to log in, and then you should be redirected back here.</p>
            <p>{response}</p>
        </div>
    }

    async componentDidMount() {
        const response = await fetch('/api/protected');
        if (response?.ok) {
            const data = await response.json();
            this.setState({ result: data, authenticated: true, loading: false, error: null });
            return;
        }

        if (!response) {
            this.setState({ loading: false, error: "Response was invalid." });
        } else {
            if (response.status === 401) {
                this.setState({ loading: false, authenticated: false, error: "Not logged in." })
            } else {
                this.setState({ loading: false, error: `${response.status} ${response.statusText}` });
            }
        }
    }
}