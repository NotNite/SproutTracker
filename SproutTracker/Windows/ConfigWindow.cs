using System;
using Dalamud.Interface.Windowing;
using ImGuiNET;

namespace SproutTracker.Windows;

public class ConfigWindow : Window, IDisposable {
    private bool dirty;

    public ConfigWindow() : base("SproutTracker") {
        this.Flags = ImGuiWindowFlags.AlwaysAutoResize;
    }

    public void Dispose() { }

    public override void Draw() {
        if (ImGui.InputText("Endpoint", ref Plugin.Configuration.Endpoint, 256))
            this.dirty = true;

        if (ImGui.InputText("Key", ref Plugin.Configuration.Key, 256))
            this.dirty = true;

        var str = this.dirty ? "Save (has unsaved changes)" : "Save";

        if (ImGui.Button(str)) {
            Plugin.Configuration.Save();
            this.dirty = false;
        }
    }
}
