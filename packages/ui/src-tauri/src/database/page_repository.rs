use crate::database::repository::GenericRepository;
use openapi::models::Page;
use surrealdb::engine::local::Db;
use surrealdb::opt::auth::Record;
use surrealdb::Surreal;

pub struct PageRepository {
    db: Surreal<Db>,
}

impl PageRepository {}

impl GenericRepository<Page> for PageRepository {
    fn new(db: Surreal<Db>) -> Self {
        Self { db }
    }

    async fn save(&self, item: Page) -> Result<Option<Page>, anyhow::Error> {
        let db = &self.db;

        println!("Saving page: {:?}", item);

        let created: Option<Page> = db.create("pages").content(item).await?;

        Ok(created)
    }

    async fn delete(&self, id: &str) -> Result<(), anyhow::Error> {
        println!("Deleting page with id: {}", id);

        // DB delete logic with self.repository.db
        Ok(())
    }
}
