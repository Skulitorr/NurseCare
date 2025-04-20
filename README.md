# NurseCare Dashboard

A modern, responsive dashboard for nursing home management built with Next.js and Tailwind CSS.

## Features

- 📊 Real-time dashboard with key metrics and charts
- 👥 Staff management with role distribution and hours tracking
- 📅 Schedule management and shift planning
- 💬 AI-powered assistant for quick queries
- 🌙 Dark mode support
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nursecare.git
cd nursecare
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nursecare/
├── assets/
│   ├── scripts/
│   │   ├── ai-widget.js
│   │   ├── dashboard.js
│   │   └── staff.js
│   └── styles/
│       ├── ai-widget.css
│       └── dashboard.css
├── pages/
│   ├── api/
│   │   └── openai.js
│   ├── _app.js
│   ├── index.js
│   └── staff.js
├── public/
│   └── images/
├── .env.local
├── .gitignore
├── LICENSE
├── next.config.js
├── package.json
└── README.md
```

## Features in Detail

### Dashboard
- Overview cards showing key metrics
- Interactive charts for data visualization
- Real-time updates (when connected to backend)

### Staff Management
- Staff list with search and filter functionality
- Role distribution chart
- Hours worked tracking
- Staff details and performance metrics

### AI Assistant
- Floating widget for quick access
- Natural language query support
- Context-aware responses
- Loading states and error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Chart.js for beautiful data visualization
- Tailwind CSS for utility-first styling
- Next.js for the amazing React framework
- OpenAI for the AI assistant capabilities 