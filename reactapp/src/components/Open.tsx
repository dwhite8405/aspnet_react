import { Component } from "react";

interface OpenProps {
}

interface OpenState {
    result: string;
    loading: boolean;
    error: string|null;
}

export class Open extends Component<OpenProps, OpenState> {
    constructor(props: OpenProps) {
        super(props);
        this.state = {
            result: "",
            loading: true,
            error: null,
        }
    }

    render() {
        let response : string;

        if (this.state.loading) {
            response = "Loading...";
        } else if (this.state.error) {
            response = this.state.error;
        } else {
            response = this.state.result;
        }

        return <div>
            <h1>Publicly accessable page</h1>
            <p>API response: {response}</p>
        </div>
    }

    async componentDidMount() {
        const response = await fetch('/api/open');
        if (response?.ok) {
            const data = await response.json();
            this.setState({ result: data, loading: false, error: null });
            return;
        }

        if (!response) {
            this.setState({ loading: false, error: "Response was invalid." });
        } else {
            if (response.status === 401) {
                this.setState({ loading: false, error: "Not logged in." })
            } else {
                this.setState({ loading: false, error: `${response.status} ${response.statusText}` });
            }
        }
    }
}