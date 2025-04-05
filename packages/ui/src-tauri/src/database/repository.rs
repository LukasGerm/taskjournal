use anyhow::Result;
use surrealdb::engine::local::Db;
use surrealdb::Surreal;

pub trait GenericRepository<T> {
    fn new(db: Surreal<Db>) -> Self
    where
        Self: Sized;

    async fn save(&self, item: T) -> Result<Option<T>, anyhow::Error>;
    async fn delete(&self, id: &str) -> Result<(), anyhow::Error>;
}
