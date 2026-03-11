import { Layout } from "@/components/layout";
import { Copy, CheckCircle2, Server, Plug } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function McpSetup() {
  const [copied, setCopied] = useState(false);
  
  // Dynamic host determination for the copyable config
  const host = window.location.host;
  const protocol = window.location.protocol;

  const configJson = `{
  "mcpServers": {
    "indiaquant": {
      "command": "node",
      "args": ["dist/index.js"], 
      "env": {
        "MCP_SSE_ENDPOINT": "${protocol}//${host}/sse",
        "MCP_POST_ENDPOINT": "${protocol}//${host}/messages"
      }
    }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(configJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 max-w-4xl">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3 text-gradient">
            <Server className="w-8 h-8 text-primary" />
            MCP Integration Setup
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-2xl">
            Connect Claude Desktop to the IndiaQuant MCP server to grant your AI agent 
            full access to real-time market intelligence, your live portfolio, and 
            virtual trading capabilities.
          </p>
        </div>

        {/* Endpoints Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-xl border border-border/50">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">SSE Endpoint</div>
            <div className="font-mono text-sm text-primary break-all">
              {protocol}//{host}/sse
            </div>
            <p className="text-xs text-muted-foreground mt-2">Used for establishing the persistent server-sent events connection.</p>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-border/50">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">POST Endpoint</div>
            <div className="font-mono text-sm text-primary break-all">
              {protocol}//{host}/messages
            </div>
            <p className="text-xs text-muted-foreground mt-2">Used by Claude to transmit operational instructions back to the server.</p>
          </div>
        </div>

        {/* Config Block */}
        <div className="glass-panel rounded-xl border border-border/50 overflow-hidden">
          <div className="bg-secondary/50 border-b border-border/50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plug className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">claude_desktop_config.json</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              className="h-8 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <><CheckCircle2 className="w-3 h-3 mr-2 text-[hsl(var(--profit))]" /> Copied</>
              ) : (
                <><Copy className="w-3 h-3 mr-2" /> Copy Config</>
              )}
            </Button>
          </div>
          <div className="p-4 bg-[#0d0d0d] overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed text-gray-300">
              <code dangerouslySetInnerHTML={{ __html: configJson.replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:').replace(/"([^"]+)"/g, (match, p1) => match.includes(':') ? match : `<span class="text-green-400">"${p1}"</span>`) }} />
            </pre>
          </div>
        </div>

        {/* Instructions list */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-lg border-b border-border/50 pb-2">Installation Steps</h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground font-sans">
            <li>Open Claude Desktop application settings.</li>
            <li>Locate the <strong>Developer Settings</strong> or click "Edit Config".</li>
            <li>Paste the JSON configuration block provided above into your <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded text-foreground">claude_desktop_config.json</code> file.</li>
            <li>Save the file and restart Claude Desktop.</li>
            <li>You should now see the plug icon indicating the IndiaQuant MCP server is connected.</li>
          </ol>
        </div>

      </div>
    </Layout>
  );
}
