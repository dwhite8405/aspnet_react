using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);

var initialScopes = builder.Configuration.GetValue<string>("DownstreamApi:Scopes")?.Split(' ');

/* Authentication works as follows: 
* If the user is not logged in, then all API requests return a 401 (unauthorized). This 401 
  is from the JwtBearer scheme, which is the only reason it's used here.
* To log in, the user needs to navigate to /login, which is served here rather than at the front-end. 
  This redirects the user to the actual login page and does OpenId token stuff.
* Once logged in, we give the user a cookie. From that point on, the user is authenticated using the 
  cookie. We don't use JWT tokens because they're less secure than a httponly secure cookie.
*/


builder.Services.AddAuthentication(options => {
    // For authentication, we use cookies authentication.
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
    .AddCookie(b=> {
        // If the user attempts to use an API without being authenticated, they get a 401 (unauthorized)
        // rather than a 302 (redirect to login).
        b.ForwardChallenge = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer() // only used for Challenge.
    // OpenIdConnect is used for the /login page. 
    .AddOpenIdConnect(options => {
        options.ClientId = "<enter your client id>";
        options.ClientSecret = builder.Configuration["ClientSecret"];
        options.Authority = "https://login.microsoftonline.com/common";
        options.CallbackPath = "/signin-oidc";
        options.ResponseType = "code";
        options.Scope.Add("openid");
        options.SaveTokens = true;
        options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; 
        options.TokenValidationParameters.ValidateIssuer = false;
    });

builder.Services.AddAuthorization(options => {
    // This is used by the example "/protected" API below.
    options.AddPolicy("protectedPolicy", policy => {
        policy.RequireAuthenticatedUser()
            .AddAuthenticationSchemes(CookieAuthenticationDefaults.AuthenticationScheme);
    });
});

builder.Services.AddControllersWithViews(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    options.Filters.Add(new AuthorizeFilter(policy));
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/login", async (ctx) =>
{
    // Redirect the user to the OpenId provider's login page.
    await ctx.ChallengeAsync(OpenIdConnectDefaults.AuthenticationScheme, 
        new AuthenticationProperties()
        {
            // When they get back, don't go to /login. 
            // TODO: maintain a redirect URL properly.
            RedirectUri = "/"
        });
}).AllowAnonymous();

app.MapGet("/logout", async (ctx) =>
{
    // Log the user out from this application.
    await ctx.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

    // Forward the user to the logout page for the OpenId Connect provider.
    // If that page is well-behaved, it should redirect back to us.
    await ctx.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme);
});

// This API request is not protected. Anybody can access it.
app.MapGet("/wideopen", () => { return Results.Ok("foo"); });

// This API requires that the user logs in first.
app.MapGet("/protected", () => { return Results.Ok("bar"); }).RequireAuthorization("protectedPolicy");

app.Run();
