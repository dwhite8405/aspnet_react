React App with ASP.NET backend
==============================

This is a template web application using React and Typescript on the front-end, and ASP.NET on the back-end with authentication enabled.

This is based on the template provided by .NET, but with Typescript and authentication added. There are some original Javascript remnants from the original template that configure proxies. 


Configuring Authentication
--------------------------

You need to configure Azure AD to make this application work. 

1. Create a Microsoft developer account. 
2. Go to https://entra.microsoft.com/
3. Click on "Applications" / "App Registrations"
4. Create a new application registration. 
  * "Accounts in any organizational directory"
  * Click "Register"
5. Copy the "Application (client) ID" into your user secrets as "ClientId".
6. Create a new "web" redirect URI to "https://localhost:3000/signin-oidc"
0. Set the front-channel logout URL to "http://localhost:44321/signout-oidc"
7. Create a new client secret. Make sure you copy it out of Azure into a safe place immediately. It can only be copied once out of Azure. After that, you need to generate a new one.

Add the client secret to your user secrets under "ClientSecret". You can do this by right-clicking on the "webapi" project, selecting "Manage User Secrets" and adding it to the JSON, or with the following command from the `webapi` directory::

    C:\stuff\source\repos\aspnet_react\webapi> dotnet user-secrets set ClientApi "s3cr3t"

Running
-------

I'm not sure how you "should" run it, but I've been opening two console windows. 

The first console does `npm start` in the React project.

The second console does `dotnet run` in the ASP.NET project.

Then you can connect your browser to https://localhost:3000/. 

Front-end
----------

Never use Javascript as a programming language. It's not worth the headache. Typescript is a significant improvement over Javascript, although it's still not as good as C#. For this reason, the original front-end written in Javascript has been replaced with a Typescript version.

I haven't added generated Typescript source from the OpenAPI schema, but you should set that up for a "real" project.

Back-end
--------

If you create more back-end APIs, you need to add them to reactapp/src/setupProxy.js.

Deploying to production
------------------------

When running in a production environment, the proxy is not used. Instead, you will need to configure a reverse HTTP proxy that will forward all back-end requests to the back-end and all other requests to the React application.

You also need to ensure that the client secrets are made available to the application using the usual means. 
