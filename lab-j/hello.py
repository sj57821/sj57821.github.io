import sys
import os

imie = "Jakub"
album = "57821"
python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
python_path = sys.executable

print(f"Hello {imie} ({album}). This environment is using Python version {python_version} at location {python_path}")