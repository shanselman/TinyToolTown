using System.Text.Json;

namespace TinyToolSummarizer;

/// <summary>
/// Fetches README content from a GitHub repository.
/// </summary>
public static class ReadmeFetcher
{
    private static readonly string[] ReadmeFileNames =
    [
        "README.md", "readme.md", "Readme.md",
        "README", "readme",
        "README.rst", "readme.rst",
        "README.txt", "readme.txt"
    ];

    public static async Task<string?> FetchReadmeAsync(HttpClient httpClient, string githubUrl)
    {
        // Parse owner/repo from github URL
        // e.g. https://github.com/owner/repo or https://github.com/owner/repo/
        var uri = new Uri(githubUrl);
        var segments = uri.AbsolutePath.Trim('/').Split('/');
        if (segments.Length < 2)
        {
            Log("⚠️  could not parse owner/repo from URL");
            return null;
        }

        var owner = segments[0];
        var repo = segments[1];

        var token = Environment.GetEnvironmentVariable("GH_TOKEN");

        // 1. Try the GitHub API for the README (handles any naming/casing automatically)
        Log($"📡 trying API: {owner}/{repo}/readme");
        var apiUrl = $"https://api.github.com/repos/{Uri.EscapeDataString(owner)}/{Uri.EscapeDataString(repo)}/readme";
        var result = await TryFetchUrl(httpClient, apiUrl, token, acceptRaw: true);
        if (result != null)
        {
            Log($"✅ fetched via API ({result.Length} chars)");
            return Truncate(result);
        }

        // 2. Fall back to raw URLs for common README filenames
        Log("⚠️  API miss, trying raw URLs...");
        foreach (var filename in ReadmeFileNames)
        {
            var rawUrl = $"https://raw.githubusercontent.com/{Uri.EscapeDataString(owner)}/{Uri.EscapeDataString(repo)}/HEAD/{filename}";
            result = await TryFetchUrl(httpClient, rawUrl, token);
            if (result != null)
            {
                Log($"✅ fetched raw {filename} ({result.Length} chars)");
                return Truncate(result);
            }
        }

        Log("❌ no README found anywhere");
        return null;
    }

    private static void Log(string message)
    {
        var prev = Console.ForegroundColor;
        Console.ForegroundColor = ConsoleColor.DarkGray;
        Console.Write($"\n     {message} ");
        Console.ForegroundColor = prev;
    }

    private static async Task<string?> TryFetchUrl(HttpClient httpClient, string url, string? token, bool acceptRaw = false)
    {
        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            if (acceptRaw)
                request.Headers.Accept.ParseAdd("application/vnd.github.v3.raw");
            if (!string.IsNullOrEmpty(token))
                request.Headers.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            var response = await httpClient.SendAsync(request, cts.Token);
            if (response.IsSuccessStatusCode)
                return await response.Content.ReadAsStringAsync(cts.Token);
        }
        catch
        {
            // Timeout or network error — fall through
        }
        return null;
    }

    private static string Truncate(string content)
    {
        if (content.Length > 4000)
            return content[..4000] + "\n\n[truncated]";
        return content;
    }
}
