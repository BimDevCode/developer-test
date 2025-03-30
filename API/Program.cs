var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IIconService, IconService>();
builder.Services.AddAutoMapper(config =>
{
    config.AddProfile<MapperProfiler>();
    config.ShouldUseConstructor = _ => true; 
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        corsPolicyBuilder => 
            corsPolicyBuilder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("AllowAllOrigins");
app.MapGet("/api/users", async (IUserService userService) =>
{
    try
    {
        var users = await userService.GetUsersAsync();
        return Results.Ok(users);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});
app.MapGet("/api/icons/{name}", async (string name, IIconService iconService) =>
{
    try
    {
        var iconBytes = await iconService.GetIconBytesAsync(name);
        return iconBytes == null ? Results.NotFound("Icon not found") : Results.File(iconBytes, "image/png");
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});
app.Run();