use anyhow::Result;

pub trait GenericRepository<T> {
    fn save(&self, item: &T) -> Result<()>;
    fn delete(&self, id: &str) -> Result<()>;
}
