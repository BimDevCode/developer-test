using AutoMapper;

public class MapperProfiler : Profile
{
    public MapperProfiler()
    {
        CreateMap<User, UserDto>()
            .ConstructUsing(src => new UserDto(
                src.Name,
                src.Age,
                src.Registered,
                src.Email,
                src.Balance,
                src.IconName ?? DataPathsConstants.InvalidImage
            ));
    }
}