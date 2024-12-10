import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Benchmarks() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelDeploymentStatus, setModelDeploymentStatus] = useState({
    OpenAI: "Deployed",
    Anthropic: "Not Deployed",
    Gemini: "Deployed",
  });

  const handleSeeDetails = (model) => {
    setSelectedModel(model);
  };

  const handleBackToOverview = () => {
    setSelectedModel(null);
  };

  const toggleDeploymentStatus = (model) => {
    setModelDeploymentStatus((prevStatus) => ({
      ...prevStatus,
      [model]: prevStatus[model] === "Deployed" ? "Not Deployed" : "Deployed",
    }));
  };

  // Dummy Summary Data
  const summaryData = [
    { label: "Total Runs", value: "12,000" },
    { label: "Avg. Success Rate", value: "89%" },
    { label: "Token Usage", value: "1,850,000" },
    { label: "Cost", value: "$ 4,243" },
  ];

  // Dummy Data for Models
  const modelPerformance = [
    { model: "OpenAI", coverage: "85%", successRate: "90%" },
    { model: "Anthropic", coverage: "86%", successRate: "89%" },
    { model: "Gemini", coverage: "84%", successRate: "91%" },
  ];

  const detailedModelStats = {
    OpenAI: {
      runs: "4,000",
      tokens: "500,000",
      cost: "$1,100",
      successRate: "90%",
      coverage: "85%",
    },
    Anthropic: {
      runs: "3,500",
      tokens: "450,000",
      cost: "$1,500",
      successRate: "89%",
      coverage: "86%",
    },
    Gemini: {
      runs: "4,500",
      tokens: "550,000",
      cost: "$1,600",
      successRate: "91%",
      coverage: "84%",
    },
  };

  return (
    <div className="container mx-auto p-6">
      {/* Summary Section */}
      {!selectedModel && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {summaryData.map((item, index) => (
            <Card key={index} className="p-4 text-center shadow-md bg-white">
              <h2 className="text-sm font-medium text-gray-500">
                {item.label}
              </h2>
              <p className="text-2xl font-semibold text-gray-800">
                {item.value}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Model Performance Table */}
      {!selectedModel && (
        <Card className="p-6 shadow-md bg-black">
          <h2 className="text-xl font-semibold mb-4">Model Performance</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Avg. Coverage</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Deployment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelPerformance.map((model, index) => (
                <TableRow key={index}>
                  <TableCell>{model.model}</TableCell>
                  <TableCell>{model.coverage}</TableCell>
                  <TableCell>{model.successRate}</TableCell>
                  <TableCell>{modelDeploymentStatus[model.model]}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSeeDetails(model.model)}
                      >
                        See Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDeploymentStatus(model.model)}
                      >
                        {modelDeploymentStatus[model.model] === "Deployed"
                          ? "Remove from Production"
                          : "Deploy"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Detailed Model View */}
      {selectedModel && (
        <Card className="p-6 shadow-md bg-white">
          <Button
            variant="outline"
            size="sm"
            className="mb-4"
            onClick={handleBackToOverview}
          >
            Back to Overview
          </Button>
          <h2 className="text-xl font-semibold text-gray-500 mb-4">
            {selectedModel} - Detailed Performance
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 shadow-sm bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500">Total Runs</h3>
              <p className="text-xl font-semibold text-gray-800">
                {detailedModelStats[selectedModel].runs}
              </p>
            </Card>
            <Card className="p-4 shadow-sm bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500">Token Usage</h3>
              <p className="text-xl font-semibold text-gray-800">
                {detailedModelStats[selectedModel].tokens}
              </p>
            </Card>
            <Card className="p-4 shadow-sm bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500">Cost</h3>
              <p className="text-xl font-semibold text-gray-800">
                {detailedModelStats[selectedModel].cost}
              </p>
            </Card>
            <Card className="p-4 shadow-sm bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500">
                Success Rate
              </h3>
              <p className="text-xl font-semibold text-gray-800">
                {detailedModelStats[selectedModel].successRate}
              </p>
            </Card>
            <Card className="p-4 shadow-sm bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500">Coverage</h3>
              <p className="text-xl font-semibold text-gray-800">
                {detailedModelStats[selectedModel].coverage}
              </p>
            </Card>
          </div>
        </Card>
      )}
    </div>
  );
}
