# FinanceTracker

A comprehensive personal finance management application with AI-powered financial advice.

## Features

- 💬 AI-powered financial chat assistant
- 📊 Financial profile management
- 🎯 Goal tracking and planning
- 📈 Investment tracking
- 💰 Budget management
- 🔒 Secure user authentication

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- AI Integration: OpenRouter API
- Stock Data: Alpha Vantage API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- OpenRouter API key (for AI features)
- Alpha Vantage API key (for stock data)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/FinanceTracker.git
cd FinanceTracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=your_postgresql_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
FinanceTracker/
├── client/              # Frontend React application
├── server/              # Backend Express server
├── shared/              # Shared types and schemas
├── migrations/          # Database migrations
└── package.json         # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 