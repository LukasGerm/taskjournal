use crate::APP_NAME;
use anyhow::anyhow;
use dirs_next;
use surrealdb::engine::local::{Db, RocksDb};
use surrealdb::Surreal;

pub async fn connect_to_database() -> Result<Surreal<Db>, anyhow::Error> {
    let dir = dirs_next::home_dir();

    match dir {
        Some(mut path) => {
            path.push(APP_NAME.to_string() + "/db");

            // Use the path with SurrealDB
            let db = Surreal::new::<RocksDb>(path).await?;

            db.use_ns("test").use_db("test").await?;

            Ok(db)
        }
        None => {
            // Handle the case where the home directory couldn't be found
            eprintln!("Error: Home directory could not be determined.");

            Err(anyhow!("Home directory could not be determined."))
        }
    }
}
