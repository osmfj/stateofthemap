# State of the Map Japan 2024 Website

## How to preview website with Docker and Visual studio code

1. Install [Docker Desktop](https://www.docker.com/) or Docker CLI and [Visual studio code](https://code.visualstudio.com/)
2. Install the [Remote development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) in visual studio code
3. Open sotmjp2024 directory from visual studio code, and select "Reopen in container" in popup dialog
   * Other way: Open sotmjp2024 directory and click the Remote window button on the Remote status bar, then select "Reopen in container"
4. Wait a moment for the build environment to be set up in docker
5. Open "new terminal" in visual studio code and enter the following command

```bash
bundle exec jekyll serve
```
