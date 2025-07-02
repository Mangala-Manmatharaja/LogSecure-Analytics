
# LogSecure Analytics 🔐

A professional web-based log file analysis platform with intelligent anomaly detection, advanced search capabilities, and comprehensive security insights.

![LogSecure Analytics](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🚀 Features

- **📁 Multi-Format Support**: Supports .txt, .log, and .csv files with intelligent parsing
- **🔍 Intelligent Anomaly Detection**: Pre-configured suspicious keywords with customizable detection rules
- **📊 Interactive Analytics Dashboard**: Real-time charts and statistics using Recharts
- **🔎 Advanced Search & Filtering**: Case-insensitive search across message content, log levels, and timestamps
- **🛡️ Security-First Design**: Client-side processing ensures your logs never leave your device
- **🎨 Modern UI/UX**: Professional, responsive design built with Tailwind CSS and Shadcn/ui
- **⚡ Real-Time Analysis**: Instant feedback and processing with progress indicators

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useMemo, useCallback)

## 📦 Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/logsecure-analytics.git
   cd logsecure-analytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Usage

1. **Upload Log File**: Click "Choose File" and select a .txt, .log, or .csv file
2. **View Logs**: Browse through parsed log entries with automatic suspicious entry detection
3. **Search**: Use the advanced search bar to filter logs by keywords
4. **Analyze**: View interactive charts and statistics in the Analytics tab
5. **Customize**: Manage suspicious keywords in the Security Keywords tab

## 📊 Supported Log Formats

### Plain Text Logs (.txt, .log)
```
2024-01-15 10:30:45 ERROR Authentication failed for user admin
2024-01-15 10:31:02 WARN Multiple failed login attempts detected
2024-01-15 10:31:15 INFO User session started successfully
```

### CSV Logs (.csv)
```csv
timestamp,level,message
2024-01-15 10:30:45,ERROR,Authentication failed for user admin
2024-01-15 10:31:02,WARN,Multiple failed login attempts detected
```

## 🔐 Security Features

- **Client-Side Processing**: All file processing happens in the browser
- **No Data Transmission**: Log files never leave your device
- **Configurable Detection**: Customizable suspicious keyword lists
- **Real-Time Analysis**: Immediate feedback on suspicious activities

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn/ui components
│   ├── AnalyticsDashboard.tsx # Charts and statistics
│   ├── FileUpload.tsx         # File upload and processing
│   ├── LogViewer.tsx          # Log display with pagination
│   ├── SearchBar.tsx          # Search functionality
│   └── SuspiciousKeywords.tsx # Keyword management
├── pages/
│   └── Index.tsx              # Main application component
├── hooks/                     # Custom React hooks
├── lib/                       # Utility functions
└── App.tsx                    # Root component
```

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Type checking
npm run type-check
```

## 🎨 Customization

### Adding New Suspicious Keywords

Navigate to the "Security Keywords" tab in the application to:
- Add new keywords to monitor
- Remove existing keywords
- View keyword frequency statistics

### Styling

The application uses Tailwind CSS for styling. You can customize the theme by modifying:
- `tailwind.config.ts` - Tailwind configuration
- `src/index.css` - Global styles
- Component-specific styles using Tailwind classes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Recharts](https://recharts.org/) - Chart library
- [Lucide React](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact me on [LinkedIn](https://linkedin.com/in/yourprofile)

---

**Made with ❤️ for the security community**
