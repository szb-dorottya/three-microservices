from fastapi import FastAPI
import mysql.connector
import uvicorn
from pydantic import BaseModel
import json

app = FastAPI()

mydb = None
mycursor = None

@app.on_event("startup")
async def on_startup():
    mydb =  mysql.connector.connect(
        host="mysqllllllllll.default.svc.cluster.local",
        user="root",
        password="CUjbxxb3qw",
        database="images_db"
    )
    mycursor =  mydb.cursor()

    #mycursor.execute("CREATE DATABASE IF NOT EXISTS images_db;")
    #mycursor.execute("USE images_db;")

    mycursor.execute("CREATE TABLE IF NOT EXISTS images (id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, name VARCHAR(100) NOT NULL, url VARCHAR(200) NOT NULL, created_at VARCHAR(20) NOT NULL);")

class Image(BaseModel):
    id: int
    name: str
    url: str
    created_at: str

def serializer(value):
    return json.dumps(value).encode()

def deserializer(serialized):
    return json.loads(serialized)

@app.get("/")
def home():
    result = {"aa": "bb"}
    return {"Data": result}

@app.get("/db")
def home():
    return {"Data": "test"}

@app.get("/api/images")
def images():
    return mycursor.execute("select * from images;")

@app.get("/api/image/{id}")
def get_video_with_id(id: int):
    return {"image with a given id": id}

@app.post("/api/images")
def create_video(image: Image):
    sql = "INSERT INTO images (name, url, created_at) VALUES (%s, %s, %s)"
    val = (image.name, image.url, image.created_at)
    mycursor.execute(sql, val)
    mydb.commit()
    return mycursor.rowcount

@app.put("/api/images/{id}")
def update_video(id: int, image: int):
   return {"it changes a image props with id"}

@app.delete("/api/images/{id}")
def delete_video(id: int):
    return {"deletes a image with id"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)