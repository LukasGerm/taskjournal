use crate::database::connect_to_database;

mod database;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    connect_to_database();
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
