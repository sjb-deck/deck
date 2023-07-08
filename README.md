# Getting Started

1. Clone the repo
    
    ```bash
    git clone https://github.com/sjb-deck/deck.git
    ```
    
2. Move into the directory
    
    ```bash
    cd deck
    ```
    
3. Install the required modules and libraries
    
    ```bash
    pip install -r requirements.txt
    ```
    
    ```bash
    npm i
    ```
    
4. Copy over the `.env` file into the current directory
5. Start the JSX compiler
    
    ```bash
    npm run dev
    ```
    
6. Open a new window, do the migrations and start the server
    
    ```bash
    python manage.py migrate
    ```
    
    ```bash
    python manage.py runserver
    ```
    
## Alternative

Run `./run.sh`, which will run the above commands for you.

🚨 Note: Some errors will not be shown when running the shell file, look into the logs folder for any errors



# Must Have VSCode Extensions

- [Black Python Formatter](https://marketplace.visualstudio.com/items?itemName=ms-python.black-formatter)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

# Useful Links

[IMS Overview](https://www.notion.so/IMS-Overview-d7f998a410c74220863d4e35464c7517)

[Server Health](https://jonasgwt.github.io/servers/)
