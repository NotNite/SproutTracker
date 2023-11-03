using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace SproutTracker;

public class ApiManager : IDisposable {
    private HttpClient client;

    public ApiManager() {
        this.client = new HttpClient();
    }
    
    public void Dispose() {
        this.client.Dispose();
    }

    private void UpdateKey() {
        this.client.DefaultRequestHeaders.Authorization = new("Bearer", Plugin.Configuration.Key);
    }

    public async Task SubmitProgress(ProgressSubmit submit) {
        var route = $"{Plugin.Configuration.Endpoint}progress/submit";
        this.UpdateKey();
        await this.client.PostAsJsonAsync(route, submit);
    }
}
