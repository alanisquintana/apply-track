use tauri::Manager;
use tauri_plugin_shell::ShellExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let data_dir = app.path().app_data_dir().expect("Failed to resolve app data dir");
            let data_dir_str = data_dir.to_str().expect("Invalid data dir path");

            let resource_dir = app.path().resource_dir().expect("Failed to resolve resource dir");
            let resource_dir_str = resource_dir.to_str().expect("Invalid resource dir path");

            let sidecar = app.shell()
                .sidecar("backend")
                .unwrap()
                .env("DB_PATH", format!("{}/applytrack.db", data_dir_str))
                .env("NATIVE_PATH", format!("{}/binaries/node_modules", resource_dir_str));

            let (_rx, _child) = sidecar.spawn().expect("Failed to start backend sidecar");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
