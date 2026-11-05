# Ground Rules

You will create UI code based on a few things.
1. Exos component registry external/variables made by the exos theme
2. Context from the users chat
3. Figma API(DO NOT USE OR ATTEMPT TO USE MCP)
4. Surrounding components 

After creating the code you will create an HTML based on insturctions in '/html-report.md'

Ensure you use icons from the icomoon package, if you cannot match the exact one, put a placeholder and put this in the HTML recap

If mutiple figma frame links are given to you, spawn a subagent for each to get most context saving possible

If anything fails, stop and alert me



## Steps
1. To call the API, send requests to https://api.figma.com with the header X-Figma-Token set to the token in the FIGMA_TOKEN environment variable. Never print the token. The file key is <FILE_KEY> and the node ID is <NODE_ID>. Write the node ID with a colon, not a dash.
2. Get the design data with GET /v1/files/<FILE_KEY>/nodes?ids=<NODE_ID>
3. Get a screenshot with GET /v1/images/<FILE_KEY>?ids=<NODE_ID>&format=png&scale=2, then download the image from the URL it returns.
4. Get the icons and illustrations: find their layer IDs in the design data, then call GET /v1/images/<FILE_KEY>?ids=<id1>,<id2>&format=svg and download each one into the assets folder right away, because the links expire.
5. Using context from '/exos-component-registry-external', 'node_modules/@exos/exos-theme-external', the users input, and figma MCP, build the UI the user wants.
6. Once compelted output an HTML that tells the user what API tools were used, the orginal user prompt(if more prompts are asked in same chat, add to HTML), what couldn't be used from our design system, the amount of tokens it took to fulfill the request, and a diff of the UI before and after your changes.

## Notes

Read the design data for layout, spacing, sizes, text styles and colors. Colors come back as 0–1 values, so multiply them by 255.
Build the page with Exos classes and --exos-* variables first. Only use custom CSS where nothing in Exos matches.


