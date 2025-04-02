mod database;

pub const APP_NAME: &str = env!("CARGO_PKG_NAME");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let db = database::connect::connect_to_database().await;
    tauri::Builder::default()
        .manage(db)
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
