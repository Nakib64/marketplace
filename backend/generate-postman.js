import fs from 'fs';
import path from 'path';

const collection = {
  info: {
    name: "Freelance Marketplace API",
    description: "Complete RESTful & Real-Time API collection for the Freelance Marketplace platform.\n\n### Authentication Tips:\n1. Run **POST /auth/login** to automatically set `{{userAccessToken}}` and `{{userRefreshToken}}` collection variables.\n2. Run **POST /admin/auth/login** to automatically set `{{adminAccessToken}}`.\n3. Tokens are also sent as secure `httpOnly` cookies (`access_token`, `refresh_token`, `admin_access_token`, `admin_refresh_token`) and supported via `Authorization: Bearer {{token}}` headers.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    { key: "baseUrl", value: "http://localhost:3000", type: "string" },
    { key: "userAccessToken", value: "", type: "string" },
    { key: "userRefreshToken", value: "", type: "string" },
    { key: "adminAccessToken", value: "", type: "string" },
    { key: "adminRefreshToken", value: "", type: "string" },
    { key: "jobId", value: "", type: "string" },
    { key: "proposalId", value: "", type: "string" },
    { key: "contractId", value: "", type: "string" },
    { key: "conversationId", value: "", type: "string" },
    { key: "withdrawalId", value: "", type: "string" }
  ],
  item: [
    {
      name: "1. Public & Marketplace Auth",
      item: [
        {
          name: "Register User (Client or Freelancer)",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "client@example.com",
                password: "StrongPassword123!",
                role: "CLIENT"
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/auth/register", host: ["{{baseUrl}}"], path: ["auth", "register"] },
            description: "Register a new user account.\n\n**Schema:**\n- `email` (string, required): Valid email address\n- `password` (string, required): Min 8 characters\n- `role` (enum, required): `\"CLIENT\"` or `\"FREELANCER\"`"
          }
        },
        {
          name: "Login User",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "if (pm.response.code === 200) {",
                  "    var json = pm.response.json();",
                  "    if (json.accessToken) {",
                  "        pm.collectionVariables.set('userAccessToken', json.accessToken);",
                  "    }",
                  "    if (json.refreshToken) {",
                  "        pm.collectionVariables.set('userRefreshToken', json.refreshToken);",
                  "    }",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "client@example.com",
                password: "StrongPassword123!"
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/auth/login", host: ["{{baseUrl}}"], path: ["auth", "login"] },
            description: "Authenticate user and issue dual tokens.\n- Automatically saves `userAccessToken` to collection variables.\n- Sets `access_token` and `refresh_token` httpOnly cookies."
          }
        },
        {
          name: "Refresh User Token",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "if (pm.response.code === 200) {",
                  "    var json = pm.response.json();",
                  "    if (json.accessToken) pm.collectionVariables.set('userAccessToken', json.accessToken);",
                  "    if (json.refreshToken) pm.collectionVariables.set('userRefreshToken', json.refreshToken);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                refreshToken: "{{userRefreshToken}}"
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/auth/refresh", host: ["{{baseUrl}}"], path: ["auth", "refresh"] },
            description: "Rotates refresh token and issues fresh token pair.\n- `refreshToken` can be passed in body OR via `refresh_token` cookie."
          }
        },
        {
          name: "Get Current User Profile (/auth/me)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/auth/me", host: ["{{baseUrl}}"], path: ["auth", "me"] },
            description: "Returns currently authenticated user session profile."
          }
        },
        {
          name: "Logout User",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/auth/logout", host: ["{{baseUrl}}"], path: ["auth", "logout"] },
            description: "Revokes active refresh token in Redis and clears cookies."
          }
        }
      ]
    },
    {
      name: "2. Admin Back-Office Auth",
      item: [
        {
          name: "Admin Staff Login",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "if (pm.response.code === 200) {",
                  "    var json = pm.response.json();",
                  "    if (json.accessToken) pm.collectionVariables.set('adminAccessToken', json.accessToken);",
                  "    if (json.refreshToken) pm.collectionVariables.set('adminRefreshToken', json.refreshToken);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "admin@marketplace.com",
                password: "SuperSecureAdminPassword123!"
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/admin/auth/login", host: ["{{baseUrl}}"], path: ["admin", "auth", "login"] },
            description: "Authenticate internal staff and administrators.\n- Automatically saves `adminAccessToken` to variables.\n- Sets `admin_access_token` and `admin_refresh_token` cookies."
          }
        },
        {
          name: "Admin Refresh Token",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                refreshToken: "{{adminRefreshToken}}"
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/admin/auth/refresh", host: ["{{baseUrl}}"], path: ["admin", "auth", "refresh"] },
            description: "Rotates admin staff tokens."
          }
        },
        {
          name: "Admin Profile (/admin/auth/me)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/auth/me", host: ["{{baseUrl}}"], path: ["admin", "auth", "me"] },
            description: "Returns staff profile, name, and assigned AdminRole."
          }
        },
        {
          name: "Admin Logout",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/auth/logout", host: ["{{baseUrl}}"], path: ["admin", "auth", "logout"] },
            description: "Revokes admin session in Redis and clears cookies."
          }
        }
      ]
    },
    {
      name: "3. User Profiles & Portfolios",
      item: [
        {
          name: "Get My Full Profile (/users/me)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/users/me", host: ["{{baseUrl}}"], path: ["users", "me"] }
          }
        },
        {
          name: "Update Client Profile",
          request: {
            method: "PATCH",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                companyName: "Acme Innovations Ltd",
                billingDetails: "House 12, Road 4, Gulshan-2, Dhaka"
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/users/me/client", host: ["{{baseUrl}}"], path: ["users", "me", "client"] }
          }
        },
        {
          name: "Update Freelancer Profile",
          request: {
            method: "PATCH",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Senior Full-Stack NestJS & Next.js Engineer",
                description: "Over 6 years of experience engineering high-scale web platforms.",
                hourlyRate: 45.00,
                skills: ["NestJS", "Next.js", "PostgreSQL", "Redis", "TypeScript"]
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/users/me/freelancer", host: ["{{baseUrl}}"], path: ["users", "me", "freelancer"] }
          }
        },
        {
          name: "Search Freelancers (Public)",
          request: {
            method: "GET",
            url: {
              raw: "{{baseUrl}}/users/freelancers?search=NestJS&minRating=4.0&page=1&limit=10",
              host: ["{{baseUrl}}"],
              path: ["users", "freelancers"],
              query: [
                { key: "search", value: "NestJS" },
                { key: "minRating", value: "4.0" },
                { key: "page", value: "1" },
                { key: "limit", value: "10" }
              ]
            }
          }
        },
        {
          name: "Get Public Freelancer Dossier",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/users/freelancers/:id", host: ["{{baseUrl}}"], path: ["users", "freelancers", ":id"], variable: [{ key: "id", value: "freelancer-user-uuid" }] }
          }
        },
        {
          name: "Add Portfolio Project",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Enterprise E-Commerce API",
                details: "Architected microservices using NestJS and Redis queue workers.",
                liveLink: "https://demo.example.com"
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/users/me/portfolio", host: ["{{baseUrl}}"], path: ["users", "me", "portfolio"] }
          }
        },
        {
          name: "Add Work History",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Lead Backend Architect",
                company: "Tech Solutions Inc.",
                description: "Managed high-load distributed cloud architectures.",
                startDate: "2022-01-01T00:00:00.000Z",
                isCurrent: true
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/users/me/work-history", host: ["{{baseUrl}}"], path: ["users", "me", "work-history"] }
          }
        }
      ]
    },
    {
      name: "4. Taxonomy (Categories & Skills)",
      item: [
        {
          name: "List Active Categories & Subcategories",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/categories", host: ["{{baseUrl}}"], path: ["categories"] }
          }
        },
        {
          name: "List Standardized Skills",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/skills", host: ["{{baseUrl}}"], path: ["skills"] }
          }
        },
        {
          name: "Admin: Create Category",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{adminAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Software & Web Development",
                slug: "software-web-development",
                description: "Custom software engineering and website building."
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/admin/categories", host: ["{{baseUrl}}"], path: ["admin", "categories"] }
          }
        },
        {
          name: "Admin: Add Subcategory",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{adminAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Full Stack Development",
                slug: "full-stack-development",
                description: "End-to-end full stack web applications."
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/admin/categories/:categoryId/subcategories", host: ["{{baseUrl}}"], path: ["admin", "categories", ":categoryId", "subcategories"], variable: [{ key: "categoryId", value: "category-uuid" }] }
          }
        },
        {
          name: "Admin: Create Skill Tag",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{adminAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "NestJS",
                slug: "nestjs",
                category: "Backend Development"
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/admin/skills", host: ["{{baseUrl}}"], path: ["admin", "skills"] }
          }
        }
      ]
    },
    {
      name: "5. Jobs & Marketplace Search",
      item: [
        {
          name: "Create Job Post (Client)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "if (pm.response.code === 201) {",
                  "    var json = pm.response.json();",
                  "    if (json.id) pm.collectionVariables.set('jobId', json.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Build High-Performance Marketplace Web Platform",
                description: "We are seeking a senior full-stack developer to architect and deploy our online freelance portal with live chat and escrow.",
                categoryId: "optional-category-uuid",
                subCategoryId: "optional-subcategory-uuid",
                budget: 650.00,
                skills: ["NestJS", "Next.js", "PostgreSQL", "Socket.io", "Redis"]
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/jobs", host: ["{{baseUrl}}"], path: ["jobs"] },
            description: "**Required Role:** `CLIENT` (Requires verified email).\nAutomatically stores `jobId` in collection variables."
          }
        },
        {
          name: "Search & Filter Open Jobs (Public)",
          request: {
            method: "GET",
            url: {
              raw: "{{baseUrl}}/jobs?search=Marketplace&minBudget=300&maxBudget=1000&page=1&limit=10",
              host: ["{{baseUrl}}"],
              path: ["jobs"],
              query: [
                { key: "search", value: "Marketplace" },
                { key: "minBudget", value: "300" },
                { key: "maxBudget", value: "1000" },
                { key: "page", value: "1" },
                { key: "limit", value: "10" }
              ]
            }
          }
        },
        {
          name: "Get Single Job Details",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/jobs/{{jobId}}", host: ["{{baseUrl}}"], path: ["jobs", "{{jobId}}"] }
          }
        },
        {
          name: "Get My Posted Jobs (Client)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/jobs/my-jobs", host: ["{{baseUrl}}"], path: ["jobs", "my-jobs"] }
          }
        },
        {
          name: "Report Job for Violations",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                reason: "Job attempts to solicit off-platform direct contact information."
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/jobs/{{jobId}}/report", host: ["{{baseUrl}}"], path: ["jobs", "{{jobId}}", "report"] }
          }
        }
      ]
    },
    {
      name: "6. Proposals & Bidding",
      item: [
        {
          name: "Submit Proposal (Freelancer)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "if (pm.response.code === 201) {",
                  "    var json = pm.response.json();",
                  "    if (json.id) pm.collectionVariables.set('proposalId', json.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                bidAmount: 600.00,
                coverLetter: "I have extensive expertise building marketplace architectures. I can deliver this project with full unit test coverage within 3 weeks.",
                workHistoryIds: [],
                portfolioItemIds: []
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/proposals/job/{{jobId}}", host: ["{{baseUrl}}"], path: ["proposals", "job", "{{jobId}}"] },
            description: "**Required Role:** `FREELANCER`.\n- Enqueues to Redis BullMQ for automated anti-circumvention scanning."
          }
        },
        {
          name: "Get My Submitted Proposals (Freelancer)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/proposals/my", host: ["{{baseUrl}}"], path: ["proposals", "my"] }
          }
        },
        {
          name: "Get Proposals for Job (Client View)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/jobs/{{jobId}}/proposals", host: ["{{baseUrl}}"], path: ["jobs", "{{jobId}}", "proposals"] }
          }
        },
        {
          name: "Accept or Reject Proposal (Client)",
          request: {
            method: "PATCH",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ status: "ACCEPTED" }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/jobs/{{jobId}}/proposals/{{proposalId}}/status", host: ["{{baseUrl}}"], path: ["jobs", "{{jobId}}", "proposals", "{{proposalId}}", "status"] }
          }
        }
      ]
    },
    {
      name: "7. Real-Time Chat & Attachments",
      item: [
        {
          name: "Reply to Proposal (Starts Conversation)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "if (pm.response.code === 201 || pm.response.code === 200) {",
                  "    var json = pm.response.json();",
                  "    if (json.conversation && json.conversation.id) pm.collectionVariables.set('conversationId', json.conversation.id);",
                  "    else if (json.id) pm.collectionVariables.set('conversationId', json.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                message: "Hello! We reviewed your proposal and would like to conduct a technical interview."
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/chat/proposals/{{proposalId}}/reply", host: ["{{baseUrl}}"], path: ["chat", "proposals", "{{proposalId}}", "reply"] }
          }
        },
        {
          name: "List My Conversations",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/chat/conversations", host: ["{{baseUrl}}"], path: ["chat", "conversations"] }
          }
        },
        {
          name: "Get Message History for Thread",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: {
              raw: "{{baseUrl}}/chat/conversations/{{conversationId}}/messages?page=1&limit=25",
              host: ["{{baseUrl}}"],
              path: ["chat", "conversations", "{{conversationId}}", "messages"],
              query: [{ key: "page", value: "1" }, { key: "limit", value: "25" }]
            }
          }
        },
        {
          name: "Send Text Message",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                content: "Sounds great! Let's schedule the kickoff call."
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/chat/conversations/{{conversationId}}/messages", host: ["{{baseUrl}}"], path: ["chat", "conversations", "{{conversationId}}", "messages"] }
          }
        },
        {
          name: "Mark Conversation Messages as Read",
          request: {
            method: "PATCH",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/chat/conversations/{{conversationId}}/read", host: ["{{baseUrl}}"], path: ["chat", "conversations", "{{conversationId}}", "read"] }
          }
        }
      ]
    },
    {
      name: "8. Contracts, Escrow & Work Delivery",
      item: [
        {
          name: "Accept Proposal & Fund Escrow (Form Contract)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "if (pm.response.code === 201 || pm.response.code === 200) {",
                  "    var json = pm.response.json();",
                  "    if (json.contract && json.contract.id) pm.collectionVariables.set('contractId', json.contract.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/contracts/from-proposal/{{proposalId}}", host: ["{{baseUrl}}"], path: ["contracts", "from-proposal", "{{proposalId}}"] },
            description: "Deducts funds from Client wallet and creates a contract in `FUNDED` status.\n- If balance is insufficient, returns SSLCommerz gateway URL."
          }
        },
        {
          name: "Get User Active & Historical Contracts",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/contracts/my", host: ["{{baseUrl}}"], path: ["contracts", "my"] }
          }
        },
        {
          name: "Get Single Contract Details",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/contracts/{{contractId}}", host: ["{{baseUrl}}"], path: ["contracts", "{{contractId}}"] }
          }
        },
        {
          name: "Submit Finished Work (Freelancer)",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/contracts/{{contractId}}/submit-work", host: ["{{baseUrl}}"], path: ["contracts", "{{contractId}}", "submit-work"] },
            description: "Freelancer submits deliverables. Contract status transitions to `PENDING_APPROVAL`."
          }
        },
        {
          name: "Approve Work & Release Escrow (Client)",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/contracts/{{contractId}}/approve-work", host: ["{{baseUrl}}"], path: ["contracts", "{{contractId}}", "approve-work"] },
            description: "Client approves work. Contract status becomes `COMPLETED`, 10% platform fee is deducted, and net payout is released to Freelancer wallet."
          }
        },
        {
          name: "Raise Dispute on Contract",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/contracts/{{contractId}}/dispute", host: ["{{baseUrl}}"], path: ["contracts", "{{contractId}}", "dispute"] },
            description: "Locks contract in `DISPUTED` status for platform admin arbitration."
          }
        }
      ]
    },
    {
      name: "9. Double-Blind Reviews",
      item: [
        {
          name: "Submit Contract Review",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                contractId: "{{contractId}}",
                rating: 5,
                feedback: "Exceptional quality, communicative, and delivered well before the deadline!"
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/reviews/contract/{{contractId}}", host: ["{{baseUrl}}"], path: ["reviews", "contract", "{{contractId}}"] },
            description: "Submits feedback. Stays `HIDDEN` until the counterpart submits their review."
          }
        },
        {
          name: "Get User Published Reviews",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/reviews/user/:userId", host: ["{{baseUrl}}"], path: ["reviews", "user", ":userId"], variable: [{ key: "userId", value: "user-uuid" }] }
          }
        }
      ]
    },
    {
      name: "10. Wallet & MFS Withdrawals",
      item: [
        {
          name: "Get Wallet Balance & Transactions",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{userAccessToken}}" }],
            url: { raw: "{{baseUrl}}/wallet/balance", host: ["{{baseUrl}}"], path: ["wallet", "balance"] }
          }
        },
        {
          name: "Request Payout Withdrawal (bKash / Nagad)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "if (pm.response.code === 201 || pm.response.code === 200) {",
                  "    var json = pm.response.json();",
                  "    if (json.withdrawal && json.withdrawal.id) pm.collectionVariables.set('withdrawalId', json.withdrawal.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{userAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                amount: 400.00,
                method: "BKASH",
                accountNumber: "01712345678"
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/wallet/withdraw", host: ["{{baseUrl}}"], path: ["wallet", "withdraw"] },
            description: "Deducts requested funds immediately from walletBalance and creates a `PENDING` withdrawal record."
          }
        }
      ]
    },
    {
      name: "11. Admin Back-Office Operations",
      item: [
        {
          name: "List Users (/admin/users)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/users?role=FREELANCER&page=1&limit=10", host: ["{{baseUrl}}"], path: ["admin", "users"], query: [{ key: "role", value: "FREELANCER" }, { key: "page", value: "1" }, { key: "limit", value: "10" }] }
          }
        },
        {
          name: "Suspend or Ban User",
          request: {
            method: "PATCH",
            header: [
              { key: "Authorization", value: "Bearer {{adminAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ isBanned: true }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/admin/users/:id/status", host: ["{{baseUrl}}"], path: ["admin", "users", ":id", "status"], variable: [{ key: "id", value: "user-uuid" }] }
          }
        },
        {
          name: "List Flagged Proposals (Moderation)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/moderation/flagged-proposals", host: ["{{baseUrl}}"], path: ["admin", "moderation", "flagged-proposals"] }
          }
        },
        {
          name: "List Pending Withdrawals",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/withdrawals?status=PENDING", host: ["{{baseUrl}}"], path: ["admin", "withdrawals"], query: [{ key: "status", value: "PENDING" }] }
          }
        },
        {
          name: "Approve Withdrawal Payout",
          request: {
            method: "PATCH",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/withdrawals/{{withdrawalId}}/approve", host: ["{{baseUrl}}"], path: ["admin", "withdrawals", "{{withdrawalId}}", "approve"] }
          }
        },
        {
          name: "Reject Withdrawal (Auto-Refund to Wallet)",
          request: {
            method: "PATCH",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/withdrawals/{{withdrawalId}}/reject", host: ["{{baseUrl}}"], path: ["admin", "withdrawals", "{{withdrawalId}}", "reject"] }
          }
        },
        {
          name: "List Active Disputes",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/disputes", host: ["{{baseUrl}}"], path: ["admin", "disputes"] }
          }
        },
        {
          name: "Arbitrate Dispute: Force Refund to Client",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{adminAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                adminNotes: "Freelancer was completely unresponsive and failed to deliver milestones."
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/admin/disputes/{{contractId}}/force-refund", host: ["{{baseUrl}}"], path: ["admin", "disputes", "{{contractId}}", "force-refund"] }
          }
        },
        {
          name: "Arbitrate Dispute: Force Release to Freelancer",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{adminAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                adminNotes: "Deliverables met all stated job specifications; client refusal unjustified."
              }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/admin/disputes/{{contractId}}/force-release", host: ["{{baseUrl}}"], path: ["admin", "disputes", "{{contractId}}", "force-release"] }
          }
        },
        {
          name: "Platform Settings: View Platform Fee %",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/settings", host: ["{{baseUrl}}"], path: ["admin", "settings"] }
          }
        },
        {
          name: "Platform Settings: Update Fee %",
          request: {
            method: "PATCH",
            header: [
              { key: "Authorization", value: "Bearer {{adminAccessToken}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ platformFeePercentage: 12.5 }, null, 2),
              options: { raw: { language: "json" } }
            },
            url: { raw: "{{baseUrl}}/admin/settings", host: ["{{baseUrl}}"], path: ["admin", "settings"] }
          }
        },
        {
          name: "View Immutable Audit Trail (/admin/audit-logs)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/audit-logs?page=1&limit=20", host: ["{{baseUrl}}"], path: ["admin", "audit-logs"], query: [{ key: "page", value: "1" }, { key: "limit", value: "20" }] }
          }
        },
        {
          name: "Marketplace Analytics & GMV Overview",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{adminAccessToken}}" }],
            url: { raw: "{{baseUrl}}/admin/analytics/overview", host: ["{{baseUrl}}"], path: ["admin", "analytics", "overview"] }
          }
        }
      ]
    }
  ]
};

const outputPath = path.resolve('postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf-8');
console.log('Successfully generated Postman Collection at:', outputPath);
