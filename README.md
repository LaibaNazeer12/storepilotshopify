# StorePilot AI 🚀
### Your AI-powered copilot for smarter ecommerce decisions

StorePilot AI is an AI-powered web application designed to help Shopify store owners and small ecommerce businesses with marketing content creation, customer review analysis, and business decision-making.

## 1. Problem Statement and Solution

### Problem Statement

Small ecommerce businesses often have limited time and resources to manage marketing, understand customer feedback, and make informed business decisions. Creating effective promotional content can be challenging, while manually analyzing customer reviews and interpreting store performance data can take considerable effort.

### Proposed Solution

StorePilot AI brings several AI-assisted ecommerce workflows together in one user-friendly application. It helps store owners generate marketing content, identify patterns in customer reviews, and receive actionable business advice.

The current prototype includes a dashboard with clearly labeled sample data. Live Shopify integration is not yet implemented.

## 2. Features

### 📊 Store Dashboard
- Displays example revenue and order metrics.
- Shows average order value and returning-customer metrics.
- Presents sample sales trends.
- Clearly labels sample data and indicates that Shopify is not connected.

### ✍️ AI Marketing Studio
- Generates marketing content using an AI model.
- Helps users create promotional copy for ecommerce products and campaigns.
- Provides generated content that users can review and copy.

### 💬 Customer Insights
- Analyzes customer reviews supplied by the user.
- Identifies recurring themes, customer sentiment, and potential improvement areas.
- Checks extracted source quotes against the original review text.

### 🧠 AI Store Advisor
- Answers ecommerce-related questions using supplied information and available demo context.
- Provides prioritized suggestions and practical next steps.
- Asks follow-up questions when additional information is needed.

## 3. Technology Stack

The application was developed using Lovable. Confirm the exact frameworks, libraries, and services from the source code before completing this section.

- **Application development:** Lovable
- **Frontend framework:** [Confirm from package.json]
- **Programming language:** [Confirm from source files]
- **UI and styling:** [Confirm from project dependencies]
- **AI provider:** [Enter actual provider]
- **AI model:** [Enter exact configured model name]
- **Backend/API integration:** [Enter the actual server-side integration]
- **Source-code hosting:** GitHub

Only list technologies and services that are actually present in the project.

## 4. Setup and Installation Instructions

### Prerequisites
- Node.js, if required by the project.
- npm or the package manager specified by the project.
- Git.
- Access to the required AI service and its credentials.

### Clone the Repository

Replace the placeholder below with your actual GitHub repository URL.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

### Install Dependencies

For a project that uses npm:

```bash
npm install
```

If the repository uses another package manager, follow its lockfile and project instructions instead.

### Configure Environment Variables

Configure the AI service credentials using the secure environment or secret-management mechanism required by the project.

Do not commit API keys, access tokens, or other secrets to GitHub. Do not expose private credentials in frontend code.

### Run the Application

For a project configured with the standard Vite development script, the command is typically:

```bash
npm run dev
```

Use the actual scripts in `package.json` if they differ. Open the local development URL displayed in the terminal.

### Try the Demo

1. Open the StorePilot AI dashboard.
2. Explore the sample ecommerce metrics.
3. Visit AI Marketing Studio and generate marketing content.
4. Use sample reviews in Customer Insights to explore review analysis.
5. Ask a starter question in AI Store Advisor.

AI functionality requires the configured AI service to be available and properly configured.

## 5. AI Methodology and Implementation

StorePilot AI uses generative AI to assist with common ecommerce tasks.

### Marketing Content Generation
The AI Marketing Studio sends the user's marketing requirements to the configured AI service and displays the generated content. Users can review and copy the output.

### Customer Review Analysis
Customer Insights processes reviews provided by the user to identify recurring themes and sentiment. Extracted source quotes are validated against the supplied review text to reduce the risk of displaying unsupported quotations.

### Contextual Store Advice
The AI Store Advisor uses the information provided by the user and available demo context to generate practical, prioritized recommendations. When necessary information is missing, it can ask follow-up questions rather than assume unsupported facts.

### Dashboard Data
The dashboard displays sample ecommerce metrics for demonstration purposes. These figures are not live Shopify analytics and should not be interpreted as actual store performance.

### Responsible AI Considerations
- Clearly distinguish sample data from real business data.
- Avoid presenting unsupported claims as verified facts.
- Validate customer-review quotations against their source text.
- Handle AI service errors and unavailable responses appropriately.
- Keep API credentials out of public source code.

## 6. AI Model Names and API Usage

**Complete this section with the actual provider and model configured in the project.**

- **AI provider:** [Enter provider name]
- **Exact model identifier:** [Enter model name from configuration]
- **API or SDK:** [Enter the actual API/SDK used]
- **Credential handling:** [Describe the actual server-side secrets or environment-variable setup]

### AI Use Cases

| Feature | AI application |
|---|---|
| AI Marketing Studio | Marketing copy generation |
| Customer Insights | Review analysis, sentiment, and recurring-theme extraction |
| AI Store Advisor | Contextual question answering and prioritized recommendations |

The AI workflows send appropriate user-provided inputs to the configured AI service and display its responses. The exact model and API details should be documented from the implementation rather than assumed.

Never include actual API keys or secret values in this README.

## 7. Product Screenshots

Add screenshots of the following application pages to a folder named `screenshots` in the repository.

Suggested structure:

```text
screenshots/
├── dashboard.png
├── marketing-studio.png
├── customer-insights.png
└── store-advisor.png
```

Insert the screenshots below after adding the actual image files:

### Store Dashboard
![StorePilot AI Dashboard](screenshots/dashboard.png)

### AI Marketing Studio
![AI Marketing Studio](screenshots/marketing-studio.png)

### Customer Insights
![Customer Insights](screenshots/customer-insights.png)

### AI Store Advisor
![AI Store Advisor](screenshots/store-advisor.png)

These image paths will work only after the corresponding screenshot files have been added to the repository with matching filenames.

## 8. Current Limitations and Future Improvements

### Current Limitations
- The application is not connected to a live Shopify store.
- Dashboard figures are sample data.
- AI responses depend on the configured model, the supplied context, and AI service availability.

### Future Improvements
- Secure Shopify integration with authorized store data.
- Live revenue, order, and product analytics.
- More personalized marketing recommendations.
- Historical customer sentiment tracking.
- Additional business insights based on real store performance.

## 9. Project Links: https://drive.google.com/drive/folders/1_btCTUG6QsknYIXBs396SeA-Vf4157tn?usp=sharing

## Conclusion

StorePilot AI demonstrates how generative AI can support ecommerce marketing, customer feedback analysis, and business decision-making in a single application. It is a functional prototype designed to make AI assistance more accessible to small ecommerce businesses, with clearly identified sample data and transparent limitations.


