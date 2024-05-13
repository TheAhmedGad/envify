# Usage

* ## wizard installation

    You can use the wizard interface with running the following command and follow steps on screen: 

    ```bash
    $ sudo envify
    ```

* ## Customized installation 
   you can customize your installation by passing services or stack to envify binary:
  * ### Stack installation
    Stack is a group of common services needed to start deploy you application you can install stack using any form of the following:  
    ```bash 
    $ sudo envify -s <stack>
    $ sudo envify --stack <stack>
    ```
    
  * ### Services installation
    ```bash 
    $ sudo envify -s  <stack>
    ```



# Available services
| Service     | status                  |
|-------------|-------------------------|
| GIT         | :white_check_mark: Done |
| Nginx       | :white_check_mark: Done |
| Redis       | :white_check_mark: Done |
| PHP         | :white_check_mark: Done |
| Composer    | :white_check_mark: Done |
| .Net Core   | :white_check_mark: Done |
| MySQL       | :white_check_mark: Done |
| MsSQL       | :white_check_mark: Done |
| Node (nvm)  | :white_check_mark: Done |
| pm2         | :white_check_mark: Done |
| angular-cli | :white_check_mark: Done |
| dotfiles    | :clock1: WIP            |
| zsh & omz   | :clock1: WIP            |



# Available stacks
| Stack     | status                  | Services                                                 |
|-----------|-------------------------|----------------------------------------------------------|
| Laravel   | :white_check_mark: Done | git, nginx, redis, php, composer, mysql, node, pm2       |
| .Net Core | :white_check_mark: Done | git, nginx, redis, dotnet, mssql, node, pm2, angular-cli |
| Node      | :clock1: WIP            | git, nginx, node, pm2                                    |

