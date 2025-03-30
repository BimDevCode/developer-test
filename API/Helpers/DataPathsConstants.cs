internal static class DataPathsConstants
{
    internal const string InvalidImage = "unknown"; 
    private const string DataFolder = "Data";
    private const string UsersFolder = "Users";
    private const string IconsFolder = "Icons";
    internal static string UsersFolderData => Path.Combine(Directory.GetCurrentDirectory(), DataFolder, UsersFolder);
    internal static string IconsFolderData => Path.Combine(Directory.GetCurrentDirectory(), DataFolder, IconsFolder);
}