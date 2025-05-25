use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        // Migration for pages table
        Migration {
            version: 1,
            description: "create_pages_table",
            sql: "CREATE TABLE pages (
                id TEXT PRIMARY KEY NOT NULL,
                userId TEXT NOT NULL,
                content TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "add_title_to_pages_table",
            sql: "ALTER TABLE pages ADD COLUMN title TEXT DEFAULT 'Untitled' NOT NULL;",
            kind: MigrationKind::Up,
        },
    ]
}
