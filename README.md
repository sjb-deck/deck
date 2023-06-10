# Getting Started

1. Clone the repo

   ```bash
   git clone https://github.com/jonasgwt/deckland.git
   ```

2. Move into the directory

   ```bash
   cd deckland
   ```

3. Set node version

   ```bash
   nvm use
   ```

4. Install the required modules and libraries

   ```bash
   pip install -r requirements.txt
   ```

   ```bash
   npm i
   ```

5. Copy over the `.env` file into the current directory
6. Start the JSX compiler

   ```bash
   npm run dev
   ```

7. Open a new window, start the live reload server 

   ```bash
   python manage.py livereload
   ```

8. Open a new window, do the migrations and start the server

   ```bash
   python manage.py migrate
   ```

   ```bash
   python manage.py runserver
   ```

# Useful Links

[IMS Overview](https://www.notion.so/IMS-Overview-d7f998a410c74220863d4e35464c7517)

[Server Health](https://jonasgwt.github.io/servers/)
