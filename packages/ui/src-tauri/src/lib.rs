use tauri_plugin_sql::{Migration, MigrationKind};

mod migrations;

pub const APP_NAME: &str = env!("CARGO_PKG_NAME");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let db_name = format!("sqlite:{}.sqlite", APP_NAME);

    let app_migrations = migrations::get_migrations();

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(&db_name, app_migrations)
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::new().build())
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
