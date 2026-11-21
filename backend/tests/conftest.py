import os

from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault("DATABASE_URL", "postgresql+psycopg://arah@127.0.0.1:5432/arah")
