using System.Collections.Concurrent;
using System.Text.Json;
using AutoMapper;

public class UserService(IMapper mapper) : IUserService
{
    private readonly JsonSerializerOptions _serializeOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task<IEnumerable<UserDto>> GetUsersAsync()
    {
        try
        {
            var users = new ConcurrentBag<UserDto>();
            var errors = new ConcurrentBag<Exception>();
            var userJsonFiles = Directory.GetFiles(DataPathsConstants.UsersFolderData);

            await Parallel.ForEachAsync(userJsonFiles, async (filePath, token) =>
            {
                try
                {
                    await using var stream = File.OpenRead(filePath);
                    var user = await JsonSerializer.DeserializeAsync<User>(stream, _serializeOptions, token);
                    if (user == null)
                        throw new JsonException($"Failed to deserialize user from {filePath}");

                    var userDto = mapper.Map<UserDto>(user);
                    users.Add(userDto);
                }
                catch (Exception ex)
                {
                    errors.Add(new Exception($"Error processing file '{filePath}'", ex));
                }
            });

            if (errors.Count > 0)
                throw new AggregateException("Errors occurred while loading users", errors);

            return users;
        }
        catch (Exception ex)
        {
            throw new Exception("Unexpected error while getting users", ex);
        }
    }

}