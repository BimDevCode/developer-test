public class IconService : IIconService
{
    public async Task<byte[]?> GetIconBytesAsync(string name)
    {
        try
        {
            var filePath = Path.Combine(DataPathsConstants.IconsFolderData, $"{name}.png");
            if (!File.Exists(filePath)) 
                filePath = Path.Combine(DataPathsConstants.IconsFolderData, $"{DataPathsConstants.InvalidImage}.png");
            await using var stream = File.OpenRead(filePath);
            var bytes = new byte[stream.Length];
            await stream.ReadExactlyAsync(bytes, 0, (int)stream.Length);
            return bytes;
        }
        catch (Exception ex)
        {
            throw new Exception("Error while getting icon", ex);
        }        
    }
}