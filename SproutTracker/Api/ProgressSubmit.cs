using System.Text.Json.Serialization;

namespace SproutTracker;

public class ProgressSubmit {
    [JsonInclude]
    [JsonPropertyName("character")]
    public required Character Character;

    [JsonInclude]
    [JsonPropertyName("quest")]
    public required uint Quest;

    [JsonInclude]
    [JsonPropertyName("sequence")]
    public required byte Sequence;

    [JsonInclude]
    [JsonPropertyName("complete")]
    public required bool Complete;
}
