use crate::database::repository::GenericRepository;
use openapi::models::Page;
use surrealdb::engine::local::Db;
use surrealdb::Surreal;

pub struct PageRepository {
    db: Surreal<Db>,
}

impl PageRepository {
    pub fn new(db: Surreal<Db>) -> Self {
        Self { db }
    }
}

impl GenericRepository<Page> for PageRepository {
    fn save(&self, item: &Page) -> Result<(), anyhow::Error> {
        let db = &self.db;

        println!("Saving page: {:?}", item);
        // DB insert/update logic with self.repository.db
        Ok(())
    }

    fn delete(&self, id: &str) -> Result<(), anyhow::Error> {
        println!("Deleting page with id: {}", id);
        // DB delete logic with self.repository.db
        Ok(())
    }
}
