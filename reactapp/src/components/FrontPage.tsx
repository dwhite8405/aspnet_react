import { Component } from "react";

export class FrontPage extends Component {
    render() {
        return <div>
            <h1>React/Typescript and ASP.NET demo with authentication</h1>
            <p>This demo shows a front-end written in React/Typescript and a back-end written in
                ASP.NET. Authentication is implemented with OpenId Connect. Routing has been added
                so that if you visit a page that requires authentication, you will be redirected back
                to that page after authentication.</p>

            <p>If you access an API that requires authentication, you will get a 401 (Unauthenticated).
                Authentication is done by redirecting the user to /login, which is implemented on the
                back-end and sets and authentication cookie in the browser.
            </p>

            <p><a href="https://localhost:7170/swagger">OpenAPI definitions</a></p>
            <p><a href="https://myaccount.microsoft.com/">https://myaccount.microsoft.com/</a></p>

        </div>
    }
}