using System.Threading;
using System.Threading.Tasks;
using Dalamud.Game.Command;
using Dalamud.Plugin;
using Dalamud.Interface.Windowing;
using Dalamud.IoC;
using SproutTracker.Windows;

namespace SproutTracker;

public sealed class Plugin : IAsyncDalamudPlugin {
    public const string CommandName = "/sprouttracker";

    public static Configuration Configuration = null!;
    public static WindowSystem WindowSystem = null!;
    public static ConfigWindow ConfigWindow = null!;
    public static MsqTracker MsqTracker = null!;

    [PluginService] internal static IDalamudPluginInterface PluginInterface { get; private set; } = null!;

    public Task LoadAsync(CancellationToken cancellationToken) {
        PluginInterface.Create<Services>();

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
        
        return Task.CompletedTask;
    }

    public ValueTask DisposeAsync() {
        Services.PluginInterface.UiBuilder.Draw -= this.Draw;
        Services.PluginInterface.UiBuilder.OpenConfigUi -= this.OpenConfigUi;
        
        Services.CommandManager.RemoveHandler(CommandName);
        
        MsqTracker.Dispose();
        
        WindowSystem.RemoveAllWindows();
        ConfigWindow.Dispose();
        
        Configuration.Save();

        return ValueTask.CompletedTask;
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
