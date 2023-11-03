using Dalamud.Game.Command;
using Dalamud.Plugin;
using Dalamud.Interface.Windowing;
using SproutTracker.Windows;

namespace SproutTracker;

public sealed class Plugin : IDalamudPlugin {
    public const string CommandName = "/sprouttracker";

    public static Configuration Configuration = null!;
    public static WindowSystem WindowSystem = null!;
    public static ConfigWindow ConfigWindow = null!;
    public static MsqTracker MsqTracker = null!;

    public Plugin(DalamudPluginInterface pluginInterface) {
        pluginInterface.Create<Services>();

        Configuration = Services.PluginInterface.GetPluginConfig() as Configuration ?? new Configuration();
        Configuration.Save();

        WindowSystem = new WindowSystem("SproutTracker");
        ConfigWindow = new ConfigWindow();
        WindowSystem.AddWindow(ConfigWindow);
        
        MsqTracker = new MsqTracker();

        Services.CommandManager.AddHandler(CommandName, new CommandInfo(OnCommand) {
            HelpMessage = "Open the config window."
        });

        Services.PluginInterface.UiBuilder.Draw += this.Draw;
        Services.PluginInterface.UiBuilder.OpenConfigUi += this.OpenConfigUi;
    }

    public void Dispose() {
        Services.PluginInterface.UiBuilder.Draw -= this.Draw;
        Services.PluginInterface.UiBuilder.OpenConfigUi -= this.OpenConfigUi;
        
        Services.CommandManager.RemoveHandler(CommandName);
        
        MsqTracker.Dispose();
        
        WindowSystem.RemoveAllWindows();
        ConfigWindow.Dispose();
        
        Configuration.Save();
    }

    private void OnCommand(string command, string args) {
        this.OpenConfigUi();
    }

    private void Draw() {
        WindowSystem.Draw();
    }

    public void OpenConfigUi() {
        ConfigWindow.IsOpen ^= true;
    }
}
