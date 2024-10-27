# AI-WARE
## AI Act Compliance Checker

A Next.js web application that interacts with users through a chatbot. The chatbot guides users step by step through a predetermined checklist to evaluate their position concerning the European Union's AI Act.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Overview

The **AI Act Compliance Checker** is designed to assist organizations and individuals in assessing their compliance with the EU AI Act. By engaging in an interactive conversation with a chatbot, users are guided through a checklist that evaluates various aspects of their AI systems and practices.

This application aims to simplify the complex requirements of the AI Act by breaking them down into manageable questions, providing users with insights into their compliance status.

## Features

- **Interactive Chatbot Interface**: Provides a seamless conversational experience to guide users through the compliance checklist.
- **User Authentication**: Secure user authentication implemented using Clerk.
- **Database Integration**: Uses Prisma ORM with PostgreSQL to store checklist steps and user responses.
- **Step-by-Step Guidance**: Walks users through a predetermined checklist covering key areas of the AI Act.
- **Real-Time Feedback**: Provides immediate insights based on user responses.
- **Easy Integration**: Built with Next.js, allowing for easy deployment and customization.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 14 or above.
- **npm or Yarn**: Package manager for installing dependencies.
- **Clerk Account**: To obtain API keys for user authentication.
- **PostgreSQL Database**: Access to a PostgreSQL database for storing data.

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/ai-act-compliance-checker.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd ai-act-compliance-checker
   ```

3. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn
   ```

4. **Set Up Environment Variables**

   Set your API keys in the `.env.local` file.

5. **Run the Development Server**

   Using npm:

   ```bash
   npm run dev
   ```

   Or using Yarn:

   ```bash
   yarn dev
   ```

6. **Access the Application**

   Open your browser and navigate to [http://localhost:3000/chat](http://localhost:3000/chat) to start using the app.

## Usage

1. **Register or Log In**

   Use the Clerk authentication to sign up or log in to your account.

2. **Start the Conversation**

   Click on the chatbot icon to initiate the interaction.

3. **Answer the Questions**

   Respond to the chatbot's prompts. The questions are designed to assess different compliance areas of the AI Act.

4. **Review Your Compliance Status**

   At the end of the checklist, the chatbot will provide a summary of your compliance position, highlighting areas that may require attention.

5. **Export Results**

   Optionally, export the assessment results for your records or further analysis.

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.

## Contact

- **Author**: [Emanuele De Rossi](https://github.com/emanuelederossi)
- **Email**: derossiemanuele98@gmail.com
