"use client";

import { useState } from "react";
import {
  Database, FileText, Scissors, Search, BarChart3, Settings,
  Plus, Trash2, Play, ChevronRight, Upload, Zap, Layers,
  GitBranch, Eye, RefreshCw, Download, Filter
} from "lucide-react";

type Tab = "connectors" | "chunking" | "indexing" | "query" | "evaluation";

interface DataSource {
  id: string;
  name: string;
  type: "file" | "url" | "api" | "database" | "s3";
  status: "connected" | "pending" | "error";
  documents: number;
  lastSync: string;
}

interface ChunkingConfig {
  strategy: "fixed" | "sentence" | "paragraph" | "semantic" | "recursive";
  chunkSize: number;
  overlap: number;
  separator: string;
}

interface IndexConfig {
  type: "flat" | "ivfflat" | "hnsw" | "annoy";
  embedding: "openai" | "sentence-transformers" | "cohere" | "local";
  dimensions: number;
  metric: "cosine" | "euclidean" | "dot";
}

interface QueryConfig {
  retriever: "similarity" | "mmr" | "hybrid" | "reranker";
  topK: number;
  scoreThreshold: number;
  rerankerModel: string;
}

interface EvalResult {
  query: string;
  precision: number;
  recall: number;
  f1: number;
  latencyMs: number;
  relevantDocs: number;
}

const mockSources: DataSource[] = [
  { id: "1", name: "Product Docs", type: "file", status: "connected", documents: 234, lastSync: "2 hours ago" },
  { id: "2", name: "Knowledge Base", type: "url", status: "connected", documents: 1250, lastSync: "1 hour ago" },
  { id: "3", name: "API Docs", type: "api", status: "pending", documents: 0, lastSync: "Never" },
  { id: "4", name: "Customer Data", type: "database", status: "connected", documents: 5600, lastSync: "30 min ago" },
];

const mockEvals: EvalResult[] = [
  { query: "How to reset password?", precision: 0.92, recall: 0.88, f1: 0.90, latencyMs: 45, relevantDocs: 3 },
  { query: "Pricing plans comparison", precision: 0.85, recall: 0.78, f1: 0.81, latencyMs: 62, relevantDocs: 5 },
  { query: "API rate limits", precision: 0.95, recall: 0.91, f1: 0.93, latencyMs: 38, relevantDocs: 2 },
  { query: "Integration with Slack", precision: 0.72, recall: 0.65, f1: 0.68, latencyMs: 55, relevantDocs: 4 },
  { query: "Data export options", precision: 0.88, recall: 0.82, f1: 0.85, latencyMs: 41, relevantDocs: 3 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("connectors");
  const [sources, setSources] = useState<DataSource[]>(mockSources);
  const [chunkConfig, setChunkConfig] = useState<ChunkingConfig>({
    strategy: "recursive", chunkSize: 500, overlap: 50, separator: "\\n\\n",
  });
  const [indexConfig, setIndexConfig] = useState<IndexConfig>({
    type: "hnsw", embedding: "openai", dimensions: 1536, metric: "cosine",
  });
  const [queryConfig, setQueryConfig] = useState<QueryConfig>({
    retriever: "hybrid", topK: 5, scoreThreshold: 0.7, rerankerModel: "cross-encoder",
  });
  const [queryInput, setQueryInput] = useState("");
  const [queryResults, setQueryResults] = useState<{ text: string; score: number; source: string }[]>([]);
  const [evals] = useState<EvalResult[]>(mockEvals);
  const [showAddSource, setShowAddSource] = useState(false);
  const [previewChunks, setPreviewChunks] = useState<string[]>([]);

  const tabs: { key: Tab; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { key: "connectors", icon: Database, label: "Data Connectors" },
    { key: "chunking", icon: Scissors, label: "Chunking" },
    { key: "indexing", icon: Layers, label: "Indexing" },
    { key: "query", icon: Search, label: "Query Pipeline" },
    { key: "evaluation", icon: BarChart3, label: "Evaluation" },
  ];

  const handlePreviewChunks = () => {
    const sampleText = "This is a sample document for testing chunking strategies. It contains multiple paragraphs with different topics.\n\nThe first topic discusses data processing and how documents are split into smaller chunks for better retrieval.\n\nThe second topic covers embedding generation and vector storage, which are crucial for semantic search.\n\nFinally, the third topic explains query processing and how the system finds the most relevant chunks for a given question.";
    const chunks: string[] = [];
    for (let i = 0; i < sampleText.length; i += chunkConfig.chunkSize - chunkConfig.overlap) {
      chunks.push(sampleText.slice(i, i + chunkConfig.chunkSize));
    }
    setPreviewChunks(chunks);
  };

  const handleQuery = () => {
    if (!queryInput.trim()) return;
    setQueryResults([
      { text: "To reset your password, go to Settings > Security > Change Password. You can also use the 'Forgot Password' link on the login page.", score: 0.94, source: "Product Docs" },
      { text: "Password requirements: minimum 8 characters, must include uppercase, lowercase, number, and special character.", score: 0.87, source: "Knowledge Base" },
      { text: "If you're locked out of your account, contact support@example.com for manual password reset assistance.", score: 0.82, source: "Knowledge Base" },
    ]);
  };

  const removeSource = (id: string) => setSources(sources.filter((s) => s.id !== id));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-brand-400">IndexForge</h1>
          <p className="text-xs text-gray-500 mt-1">RAG Pipeline Builder</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === tab.key ? "bg-brand-600/20 text-brand-400" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500">Pipeline Status</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-sm text-green-400">Ready</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{sources.filter((s) => s.status === "connected").length} sources connected</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Connectors Tab */}
        {activeTab === "connectors" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Data Connectors</h2>
                <p className="text-gray-500 mt-1">Connect data sources for your RAG pipeline</p>
              </div>
              <button onClick={() => setShowAddSource(true)} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-medium">
                <Plus size={16} /> Add Source
              </button>
            </div>

            {showAddSource && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h3 className="font-medium mb-4">Add Data Source</h3>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { type: "file", icon: FileText, label: "Files", desc: "PDF, TXT, MD, DOCX" },
                    { type: "url", icon: Search, label: "Web URL", desc: "Crawl web pages" },
                    { type: "api", icon: Zap, label: "API", desc: "REST/GraphQL endpoints" },
                    { type: "database", icon: Database, label: "Database", desc: "PostgreSQL, MySQL" },
                    { type: "s3", icon: Upload, label: "S3 Bucket", desc: "AWS S3 storage" },
                  ].map((source) => (
                    <button
                      key={source.type}
                      onClick={() => {
                        setSources([...sources, {
                          id: Date.now().toString(), name: `New ${source.label}`, type: source.type as DataSource["type"],
                          status: "pending", documents: 0, lastSync: "Never",
                        }]);
                        setShowAddSource(false);
                      }}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-colors"
                    >
                      <source.icon size={24} className="text-brand-400" />
                      <span className="text-sm font-medium">{source.label}</span>
                      <span className="text-xs text-gray-500">{source.desc}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAddSource(false)} className="mt-3 text-sm text-gray-500 hover:text-gray-300">Cancel</button>
              </div>
            )}

            <div className="grid gap-4">
              {sources.map((source) => (
                <div key={source.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${source.status === "connected" ? "bg-green-900/30" : source.status === "error" ? "bg-red-900/30" : "bg-yellow-900/30"}`}>
                      <Database size={18} className={source.status === "connected" ? "text-green-400" : source.status === "error" ? "text-red-400" : "text-yellow-400"} />
                    </div>
                    <div>
                      <h3 className="font-medium">{source.name}</h3>
                      <p className="text-sm text-gray-500">{source.type.toUpperCase()} | {source.documents.toLocaleString()} documents | Last sync: {source.lastSync}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${source.status === "connected" ? "bg-green-900/30 text-green-400" : source.status === "error" ? "bg-red-900/30 text-red-400" : "bg-yellow-900/30 text-yellow-400"}`}>
                      {source.status}
                    </span>
                    <button className="p-2 hover:bg-gray-800 rounded-lg"><RefreshCw size={14} /></button>
                    <button onClick={() => removeSource(source.id)} className="p-2 hover:bg-gray-800 rounded-lg text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chunking Tab */}
        {activeTab === "chunking" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Chunking Configuration</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-medium mb-4">Strategy</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Chunking Strategy</label>
                    <select value={chunkConfig.strategy} onChange={(e) => setChunkConfig({ ...chunkConfig, strategy: e.target.value as ChunkingConfig["strategy"] })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                      <option value="fixed">Fixed Size</option>
                      <option value="sentence">Sentence</option>
                      <option value="paragraph">Paragraph</option>
                      <option value="semantic">Semantic</option>
                      <option value="recursive">Recursive Character</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Chunk Size: {chunkConfig.chunkSize}</label>
                    <input type="range" min="100" max="2000" step="50" value={chunkConfig.chunkSize} onChange={(e) => setChunkConfig({ ...chunkConfig, chunkSize: parseInt(e.target.value) })} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Overlap: {chunkConfig.overlap}</label>
                    <input type="range" min="0" max="200" step="10" value={chunkConfig.overlap} onChange={(e) => setChunkConfig({ ...chunkConfig, overlap: parseInt(e.target.value) })} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Separator</label>
                    <input value={chunkConfig.separator} onChange={(e) => setChunkConfig({ ...chunkConfig, separator: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono" />
                  </div>
                  <button onClick={handlePreviewChunks} className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-medium">
                    <Eye size={14} /> Preview Chunks
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-medium mb-4">Chunk Preview</h3>
                {previewChunks.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">Click "Preview Chunks" to see results</p>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {previewChunks.map((chunk, i) => (
                      <div key={i} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-brand-400">Chunk {i + 1}</span>
                          <span className="text-xs text-gray-500">{chunk.length} chars</span>
                        </div>
                        <p className="text-sm text-gray-300">{chunk}</p>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 text-center">{previewChunks.length} chunks generated</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Indexing Tab */}
        {activeTab === "indexing" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Index Configuration</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                <h3 className="font-medium">Index Settings</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Index Type</label>
                  <select value={indexConfig.type} onChange={(e) => setIndexConfig({ ...indexConfig, type: e.target.value as IndexConfig["type"] })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option value="flat">Flat (Exact)</option>
                    <option value="ivfflat">IVF Flat</option>
                    <option value="hnsw">HNSW</option>
                    <option value="annoy">Annoy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Embedding Provider</label>
                  <select value={indexConfig.embedding} onChange={(e) => setIndexConfig({ ...indexConfig, embedding: e.target.value as IndexConfig["embedding"] })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option value="openai">OpenAI (text-embedding-3-small)</option>
                    <option value="sentence-transformers">Sentence Transformers</option>
                    <option value="cohere">Cohere</option>
                    <option value="local">Local Model</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Dimensions</label>
                  <input type="number" value={indexConfig.dimensions} onChange={(e) => setIndexConfig({ ...indexConfig, dimensions: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Distance Metric</label>
                  <select value={indexConfig.metric} onChange={(e) => setIndexConfig({ ...indexConfig, metric: e.target.value as IndexConfig["metric"] })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option value="cosine">Cosine Similarity</option>
                    <option value="euclidean">Euclidean Distance</option>
                    <option value="dot">Dot Product</option>
                  </select>
                </div>
                <button className="w-full bg-brand-600 hover:bg-brand-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                  <Play size={14} /> Build Index
                </button>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-medium mb-4">Index Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-800">
                        <th className="text-left py-2">Type</th>
                        <th className="text-right py-2">Speed</th>
                        <th className="text-right py-2">Accuracy</th>
                        <th className="text-right py-2">Memory</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { type: "Flat", speed: "Slow", accuracy: "100%", memory: "High" },
                        { type: "IVF Flat", speed: "Fast", accuracy: "95%", memory: "Medium" },
                        { type: "HNSW", speed: "Very Fast", accuracy: "97%", memory: "High" },
                        { type: "Annoy", speed: "Fast", accuracy: "93%", memory: "Low" },
                      ].map((row) => (
                        <tr key={row.type} className={`border-b border-gray-800/50 ${indexConfig.type === row.type.toLowerCase().replace(" ", "") ? "text-brand-400" : ""}`}>
                          <td className="py-2 font-medium">{row.type}</td>
                          <td className="py-2 text-right">{row.speed}</td>
                          <td className="py-2 text-right">{row.accuracy}</td>
                          <td className="py-2 text-right">{row.memory}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Query Pipeline Tab */}
        {activeTab === "query" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Query Pipeline</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
                <h3 className="font-medium">Retriever Config</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Retrieval Strategy</label>
                  <select value={queryConfig.retriever} onChange={(e) => setQueryConfig({ ...queryConfig, retriever: e.target.value as QueryConfig["retriever"] })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option value="similarity">Similarity Search</option>
                    <option value="mmr">MMR (Maximum Marginal Relevance)</option>
                    <option value="hybrid">Hybrid (BM25 + Vector)</option>
                    <option value="reranker">Re-ranker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Top-K: {queryConfig.topK}</label>
                  <input type="range" min="1" max="20" value={queryConfig.topK} onChange={(e) => setQueryConfig({ ...queryConfig, topK: parseInt(e.target.value) })} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Score Threshold: {queryConfig.scoreThreshold}</label>
                  <input type="range" min="0" max="1" step="0.05" value={queryConfig.scoreThreshold} onChange={(e) => setQueryConfig({ ...queryConfig, scoreThreshold: parseFloat(e.target.value) })} className="w-full" />
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="font-medium mb-4">Test Query</h3>
                  <div className="flex gap-3">
                    <input value={queryInput} onChange={(e) => setQueryInput(e.target.value)} placeholder="Enter a test query..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm" onKeyDown={(e) => e.key === "Enter" && handleQuery()} />
                    <button onClick={handleQuery} className="bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Search size={14} /> Search
                    </button>
                  </div>
                </div>
                {queryResults.length > 0 && (
                  <div className="space-y-3">
                    {queryResults.map((result, i) => (
                      <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-brand-400">Result {i + 1}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">Source: {result.source}</span>
                            <span className="text-xs bg-brand-900/30 text-brand-400 px-2 py-0.5 rounded-full">Score: {result.score.toFixed(2)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">{result.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Evaluation Tab */}
        {activeTab === "evaluation" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Evaluation Dashboard</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Avg Precision", value: (evals.reduce((s, e) => s + e.precision, 0) / evals.length).toFixed(2), color: "text-green-400" },
                { label: "Avg Recall", value: (evals.reduce((s, e) => s + e.recall, 0) / evals.length).toFixed(2), color: "text-blue-400" },
                { label: "Avg F1 Score", value: (evals.reduce((s, e) => s + e.f1, 0) / evals.length).toFixed(2), color: "text-purple-400" },
                { label: "Avg Latency", value: `${Math.round(evals.reduce((s, e) => s + e.latencyMs, 0) / evals.length)}ms`, color: "text-yellow-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="font-medium mb-4">Evaluation Results</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left py-3">Query</th>
                    <th className="text-right py-3">Precision</th>
                    <th className="text-right py-3">Recall</th>
                    <th className="text-right py-3">F1</th>
                    <th className="text-right py-3">Latency</th>
                    <th className="text-right py-3">Docs</th>
                  </tr>
                </thead>
                <tbody>
                  {evals.map((e, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-3">{e.query}</td>
                      <td className="py-3 text-right"><span className={e.precision >= 0.8 ? "text-green-400" : "text-yellow-400"}>{e.precision.toFixed(2)}</span></td>
                      <td className="py-3 text-right"><span className={e.recall >= 0.8 ? "text-green-400" : "text-yellow-400"}>{e.recall.toFixed(2)}</span></td>
                      <td className="py-3 text-right font-medium"><span className={e.f1 >= 0.8 ? "text-green-400" : "text-yellow-400"}>{e.f1.toFixed(2)}</span></td>
                      <td className="py-3 text-right text-gray-400">{e.latencyMs}ms</td>
                      <td className="py-3 text-right text-gray-400">{e.relevantDocs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
