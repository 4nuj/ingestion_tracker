import React, { useState, useEffect, FC } from "react";
import { getPipelineStatus, runPipeline } from "./AdfService";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Node,
  Edge,
} from "react-flow-renderer";
import { Button, Badge, Box, TextField } from "@mui/material";
import { PlayArrow as PlayIcon } from "@mui/icons-material";

const pipelineStatuses: Record<string, string> = {
  Running: "#48bb78", // Green
  Completed: "#4299e1", // Blue
  Failed: "#f56565", // Red
};

// Assign color for categories dynamically
const assignCategoryColor = (pipelineName: string): string => {
  if (pipelineName.toLowerCase().includes("ingest")) return "#48bb78"; // Green
  if (pipelineName.toLowerCase().includes("cdc")) return "#f6ad55"; // Orange
  return "#4299e1"; // Blue
};

const App: FC = () => {
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleStartPipeline = async (pipelineName: string) => {
    try {
      setLoading(true);
      const result = await runPipeline(pipelineName);
      alert(`Pipeline ${pipelineName} started: Run ID ${result.runId}`);
    } catch (error) {
      console.error("Failed to start pipeline:", error);
      alert(`Failed to start pipeline: ${pipelineName}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchPipelines = async () => {
    try {
      setLoading(true);
      const data = await getPipelineStatus();
      if (data && data.value && Array.isArray(data.value)) {
        setPipelines(
          data.value.map((pipeline: any) => ({
            ...pipeline,
            status: "Completed", // Simulated status
          }))
        );
      } else {
        setPipelines([]);
      }
    } catch (error) {
      console.error("Failed to fetch pipelines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const filteredPipelines = pipelines.filter((pipeline) =>
    pipeline.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nodes: Node[] = filteredPipelines.map((pipeline, index) => ({
    id: pipeline.name,
    data: {
      label: (
        <Box
          style={{
            background: assignCategoryColor(pipeline.name),
            padding: "10px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            color: "#fff",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            {pipeline.name}
          </div>
          <Badge
            badgeContent={pipeline.status}
            style={{
              background: pipelineStatuses[pipeline.status],
              padding: "5px 8px",
              borderRadius: "10px",
              marginTop: "5px",
            }}
          />
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={() => handleStartPipeline(pipeline.name)}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              marginTop: "10px",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            Start
          </Button>
        </Box>
      ),
    },
    position: { x: index * 300, y: 150 },
  }));

  const edges: Edge[] = filteredPipelines.slice(1).map((pipeline, index) => ({
    id: `edge-${index}`,
    source: filteredPipelines[index].name,
    target: pipeline.name,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
      color: "#a0aec0", // Gray arrows
    },
    animated: true,
    style: { strokeWidth: 2, stroke: "#cbd5e0" }, // Soft gray for edges
  }));

  return (
    <div
      style={{
        padding: "20px",
        background: "linear-gradient(120deg, #edf2f7, #e2e8f0)",
        minHeight: "100vh",
      }}
    >
      <TextField
        placeholder="Search Pipelines"
        variant="outlined"
        style={{ marginBottom: "20px", width: "100%" }}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {loading ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          Loading...
        </Box>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          style={{ width: "100%", height: "75vh" }}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      )}
    </div>
  );
};

export default App;
