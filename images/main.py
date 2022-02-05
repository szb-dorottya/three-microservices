from datetime import datetime
from typing import Optional
from databases import Database
from fastapi import FastAPI
import pytz
import uvicorn
from pydantic import BaseModel

app = FastAPI()
#database = Database("mysql+pymysql://root:password@localhost:3306/images_db")
database = Database("mysql+pymysql://root:CUjbxxb3qw@mysqllllllllll.default.svc.cluster.local:3306/images_db")

@app.on_event("startup")
async def on_startup():
   await database.connect()

class Image(BaseModel):
    id: Optional[int] = None
    name: str
    url: str
    created_at: Optional[str] = None

@app.get("/")
def home():
    result = {"test": "api"}
    return {"Data": result}

@app.get("/api/images")
async def images():
    query = "SELECT * FROM images"
    rows = await database.fetch_all(query=query)
    return rows

@app.get("/api/image/{id}")
async def get_video_with_id(id: int):
    query = "SELECT * FROM images WHERE id = :idd"
    values = {"idd": id}
    result = await database.fetch_one(query=query, values=values)
    return result

@app.post("/api/images")
async def create_video(image: Image):
    query = "INSERT INTO images(name, url, created_at) VALUES (:name, :url, :created_at)"
    now = datetime.now(pytz.timezone('Europe/Bucharest'))
    date_time = now.strftime("%Y-%m-%d %H:%M:%S")
    values = {"name": image.name, "url": image.url, "created_at": date_time}
    id = await database.execute(query=query, values=values)
    return {"id":id}

@app.put("/api/images/{id}")
async def update_video(id: int, image: Image):
    query = "UPDATE images SET name = :name, url = :url WHERE id = :id"
    values = {"name": image.name, "url": image.url, "id": id}
    id = await database.execute(query=query, values=values)
    return {"id":id}

@app.delete("/api/images/{id}")
async def delete_video(id: int):
    query = "DELETE FROM images WHERE id = :id"
    values = { "id": id}
    id = await database.execute(query=query, values=values)
    return {"rows affected":id}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)