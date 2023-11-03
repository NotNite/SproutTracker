using Dalamud.Configuration;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SproutTracker;

[Serializable]
public class Configuration : IPluginConfiguration {
    public int Version { get; set; } = 0;
    
    [JsonProperty] public string Endpoint = string.Empty;
    [JsonProperty] public string Key = string.Empty;
    [JsonProperty] public Dictionary<ulong, QuestProgression> QuestProgression = new();
    
    public void Save() {
        Services.PluginInterface.SavePluginConfig(this);
    }
}
