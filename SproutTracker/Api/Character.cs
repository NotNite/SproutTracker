using System.Text.Json.Serialization;
using Dalamud.Utility;

namespace SproutTracker;

public class Character {
    [JsonInclude]
    [JsonPropertyName("contentId")]
    public ulong ContentId = Services.ClientState.LocalContentId;

    [JsonInclude]
    [JsonPropertyName("name")]
    public string Name = Services.ClientState.LocalPlayer!.Name.TextValue;

    [JsonInclude]
    [JsonPropertyName("world")]
    public string World = Services.ClientState.LocalPlayer.HomeWorld.Value.Name.ExtractText();
}
