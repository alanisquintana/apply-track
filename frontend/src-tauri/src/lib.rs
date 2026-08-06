use tauri::Manager;
use tauri_plugin_shell::{process::CommandEvent, ShellExt};
use std::fs::OpenOptions;
use std::io::Write;

/// Node cannot resolve native modules against verbatim `\\?\C:\...` extended
/// windows paths, so strip that prefix before handing paths to the backend.
fn clean_win_path(p: &str) -> String {
    if p.starts_with("\\\\?\\") {
        p[4..].to_string()
    } else {
        p.to_string()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let data_dir = app.path().app_data_dir().expect("Failed to resolve app data dir");
            let data_dir_str = clean_win_path(data_dir.to_str().expect("Invalid data dir path"));

            let resource_dir = app.path().resource_dir().expect("Failed to resolve resource dir");
            let resource_dir_str =
                clean_win_path(resource_dir.to_str().expect("Invalid resource dir path"));

            let log_path = format!("{data_dir_str}/backend.log");

            let (mut rx, child) = app.shell()
                .sidecar("backend")
                .expect("failed to locate backend sidecar")
                .env("DB_PATH", format!("{data_dir_str}/applytrack.db"))
                .env("NATIVE_PATH", format!("{resource_dir_str}/binaries/node_modules"))
                .spawn()
                .expect("failed to spawn backend sidecar");

            // Keep the child alive for the backend survive the app.
            std::mem::forget(child);

            std::thread::spawn(move || {
                let mut log = OpenOptions::new()
                    .create(true)
                    .append(true)
                    .open(&log_path)
                    .unwrap_or_else(|e| panic!("failed to open backend log: {e}"));

                let _ = writeln!(log, "backend] data_dir={data_dir_str}");
                let _ = writeln!(log, "backend] resource_dir={resource_dir_str}");
                let _ = writeln!(
                    log,
                    "backend] db_parent_exists={}",
                    std::path::Path::new(&format!("{data_dir_str}/applytrack.db"))
                        .parent()
                        .map(|p| p.exists())
                        .unwrap_or(false)
                );
                let _ = writeln!(log, "backend] watching sidecar events");

                while let Some(event) = tauri::async_runtime::block_on(rx.recv()) {
                    match event {
                        CommandEvent::Stderr(bytes) => {
                            let _ = writeln!(log, "[stderr] {}", String::from_utf8_lossy(&bytes));
                        }
                        CommandEvent::Stdout(bytes) => {
                            let _ = writeln!(log, "[stdout] {}", String::from_utf8_lossy(&bytes));
                        }
                        CommandEvent::Terminated(payload) => {
                            let _ = writeln!(
                                log,
                                "[terminated] code={:?} signal={:?}",
                                payload.code, payload.signal
                            );
                            break;
                        }
                        CommandEvent::Error(e) => {
                            let _ = writeln!(log, "[error] {}", e);
                        }
                        _ => {}
                    }
                    let _ = log.flush();
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}