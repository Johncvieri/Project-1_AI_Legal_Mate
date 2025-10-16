// n8n workflow configuration for AI Legal Mate
// This file contains the workflow definitions for n8n automation

module.exports = {
  // Workflow for processing legal document uploads
  documentProcessingWorkflow: {
    name: "Legal Document Processing",
    nodes: [
      {
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        position: [240, 300],
        parameters: {
          path: "document-upload",
          responseMode: "responseNode",
          responseCode: 200,
          responseData: "allEntries",
          responseBinaryPropertyName: "data"
        }
      },
      {
        name: "Process Document",
        type: "n8n-nodes-base.function",
        position: [500, 300],
        parameters: {
          functionCode: `
            // Extract document content and process it
            const documentContent = $input.all()[0].json.content;
            
            // Perform basic validation
            if (!documentContent || documentContent.length < 10) {
              throw new Error("Document content is too short or missing");
            }
            
            // Prepare data for further processing
            return [{
              json: {
                originalContent: documentContent,
                processed: true,
                length: documentContent.length,
                timestamp: new Date().toISOString()
              }
            }];
          `
        }
      },
      {
        name: "AI Analysis",
        type: "n8n-nodes-base.httpRequest",
        position: [780, 300],
        parameters: {
          url: "{{\$json.baseUrl}}/api/ai/analyze-contract",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {{\$json.apiKey}}"
          },
          body: {
            contractText: "={{\$json.originalContent}}"
          }
        }
      }
    ],
    connections: {
      "Webhook": {
        main: [
          [
            {
              node: "Process Document",
              type: "main",
              index: 0
            }
          ]
        ]
      },
      "Process Document": {
        main: [
          [
            {
              node: "AI Analysis",
              type: "main",
              index: 0
            }
          ]
        ]
      }
    }
  },
  
  // Workflow for handling AI legal queries
  aiQueryWorkflow: {
    name: "AI Legal Query Processing",
    nodes: [
      {
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        position: [240, 300],
        parameters: {
          path: "ai-query",
          responseMode: "responseNode",
          responseCode: 200,
          responseData: "allEntries"
        }
      },
      {
        name: "Validate Query",
        type: "n8n-nodes-base.function",
        position: [500, 300],
        parameters: {
          functionCode: `
            const query = $input.all()[0].json.question;
            
            // Basic validation
            if (!query || query.length < 5) {
              throw new Error("Query is too short");
            }
            
            return [{
              json: {
                originalQuery: query,
                validated: true,
                timestamp: new Date().toISOString()
              }
            }];
          `
        }
      },
      {
        name: "AI Processing",
        type: "n8n-nodes-base.httpRequest",
        position: [780, 300],
        parameters: {
          url: "{{\$json.baseUrl}}/api/ai/ask",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {{\$json.apiKey}}"
          },
          body: {
            question: "={{\$json.originalQuery}}"
          }
        }
      }
    ],
    connections: {
      "Webhook": {
        main: [
          [
            {
              node: "Validate Query",
              type: "main",
              index: 0
            }
          ]
        ]
      },
      "Validate Query": {
        main: [
          [
            {
              node: "AI Processing",
              type: "main",
              index: 0
            }
          ]
        ]
      }
    }
  },
  
  // Workflow for case management automation
  caseManagementWorkflow: {
    name: "Case Management Automation",
    nodes: [
      {
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        position: [240, 300],
        parameters: {
          path: "case-update",
          responseMode: "responseNode",
          responseCode: 200,
          responseData: "allEntries"
        }
      },
      {
        name: "Update Case",
        type: "n8n-nodes-base.httpRequest",
        position: [500, 300],
        parameters: {
          url: "{{\$json.baseUrl}}/api/cases/{{\$json.caseId}}",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {{\$json.apiKey}}"
          },
          body: {
            status: "={{\$json.newStatus}}",
            progress: "={{\$json.newProgress}}"
          }
        }
      },
      {
        name: "Send Notification",
        type: "n8n-nodes-base.httpRequest",
        position: [780, 300],
        parameters: {
          url: "{{\$json.baseUrl}}/api/notifications/send",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {{\$json.apiKey}}"
          },
          body: {
            userId: "={{\$json.userId}}",
            message: "Case status updated to: {{\$json.newStatus}}",
            type: "case_update"
          }
        }
      }
    ],
    connections: {
      "Webhook": {
        main: [
          [
            {
              node: "Update Case",
              type: "main",
              index: 0
            }
          ]
        ]
      },
      "Update Case": {
        main: [
          [
            {
              node: "Send Notification",
              type: "main",
              index: 0
            }
          ]
        ]
      }
    }
  }
};