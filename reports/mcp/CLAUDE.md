# Ground Rules

You will create UI code based on a few things.
1. Exos component registry external/variables made by the exos theme
2. Context from the users chat
3. Figma MCP(a workaround is needed since we directly cannot use MCP)
4. Surrounding components 

After creating the code you will create a very basic, easy to read HTML that flags what was used by the exos design library and what needed to be made as a new variable. Exmaples are border colors, customized spacing tokens etc. 

Ensure you use icons from the icomoon package, if you cannot match the exact one, put a placeholder and put this in the HTML recap

If mutiple figma mcp links are given to you, spawn a subagent for each to get most context saving possible


## Steps
1. Figmas local server on my machine is open at http://127.0.0.1:3845/mcp. Send a 'initialize' call to this URL using curl to start the session. 
2. Request 'tools/list', this will allow you to see the tools MCP has to offer. Use the appropriate tools to get enough context to fulfill the users request
3. Using context from '/exos-component-registry-external', 'node_modules/@exos/exos-theme-external', the users input, and figma MCP, build the UI the user wants.
4. Once compelted output an HTML that tells the user what MCP tools were used, the orginal user prompt(if more prompts are asked in same chat, add to HTML), what couldn't be used from our design system, the amount of tokens it took to fulfill the request, and a diff of the UI before and after your changes.




