# FastiFlow - AI-Powered Intermittent Fasting App

FastiFlow is a comprehensive web application that helps individuals find and stick to personalized intermittent fasting schedules using AI-powered guidance and progress tracking.

## 🚀 Features

### Core Features
- **AI-Powered Schedule Generation**: Personalized intermittent fasting schedules based on user profile
- **Daily AI Check-ins**: Interactive chatbot for daily guidance and schedule adjustments
- **Visual Fasting Timer**: Real-time timer with progress tracking and historical data
- **Voice Journaling**: Audio recording with automatic transcription using OpenAI Whisper
- **Advanced Analytics**: Comprehensive progress tracking with mood trends and statistics

### Premium Features
- **Unlimited AI Interactions**: No limits on daily check-ins and schedule generation
- **Voice Transcription**: Automatic speech-to-text for journal entries
- **IPFS Storage**: Decentralized storage for audio files using Pinata
- **Detailed Analytics**: Advanced progress reports and data export
- **Priority Support**: Enhanced customer support

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Date-fns** - Date manipulation

### Backend Services
- **Firebase Authentication** - User authentication and management
- **Firebase Firestore** - NoSQL database for user data
- **OpenAI API** - AI-powered features and transcription
- **Stripe** - Payment processing and subscription management
- **Pinata/IPFS** - Decentralized storage for audio files

## 📋 Prerequisites

Before running the application, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Firebase project set up
- OpenAI API key
- Stripe account (for payments)
- Pinata account (for IPFS storage)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-3267.git
   cd this-is-a-3267
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # OpenAI Configuration
   VITE_OPENAI_API_KEY=your_openai_api_key

   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

   # Pinata Configuration (Optional)
   VITE_PINATA_API_KEY=your_pinata_api_key
   VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key
   ```

4. **Set up Firebase**
   - Create a new Firebase project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Deploy the Firestore security rules from `firestore.rules`

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AIChatInterface.jsx
│   ├── ErrorBoundary.jsx
│   ├── FastingTimer.jsx
│   ├── Layout.jsx
│   ├── LoadingSpinner.jsx
│   ├── ProgressChart.jsx
│   ├── ProtectedRoute.jsx
│   └── VoiceRecorder.jsx
├── contexts/           # React contexts for state management
│   ├── AuthContext.jsx
│   └── FastingContext.jsx
├── pages/             # Main application pages
│   ├── Auth.jsx
│   ├── Dashboard.jsx
│   ├── Journal.jsx
│   ├── Onboarding.jsx
│   └── Timer.jsx
├── services/          # External service integrations
│   ├── audio.js       # Audio recording utilities
│   ├── firestore.js   # Firestore database operations
│   ├── openai.js      # OpenAI API integration
│   ├── pinata.js      # IPFS storage via Pinata
│   └── stripe.js      # Payment processing
├── config/            # Configuration files
│   └── firebase.js    # Firebase configuration
├── App.jsx            # Main application component
├── main.jsx          # Application entry point
└── index.css         # Global styles
```

## 🔐 Security & Privacy

### Data Protection
- All user data is stored securely in Firebase Firestore
- Audio files are optionally stored on IPFS for decentralization
- Firestore security rules ensure users can only access their own data
- Authentication is handled by Firebase Auth with industry-standard security

### API Security
- OpenAI API calls are made client-side (consider moving to backend for production)
- Stripe payments are processed securely through Stripe Checkout
- Environment variables are used for all sensitive configuration

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
docker build -t fastiflow .
docker run -p 3000:3000 fastiflow
```

### Environment-Specific Configuration
- Development: Uses `.env.local`
- Production: Configure environment variables in your hosting platform

## 📊 Data Model

### User Profile
```javascript
{
  userId: string,
  email: string,
  displayName: string,
  age: number,
  gender: string,
  weight: number,
  goal: string,
  wakeTime: string,
  sleepTime: string,
  currentFastingSchedule: object,
  isOnboarded: boolean,
  premiumTierExpiry: timestamp
}
```

### Fasting Log
```javascript
{
  logId: string,
  userId: string,
  startTime: timestamp,
  endTime: timestamp,
  duration: number, // minutes
  mood: number, // 1-5 scale
  notes: string
}
```

### Journal Entry
```javascript
{
  entryId: string,
  userId: string,
  timestamp: timestamp,
  text: string,
  audioUrl: string, // IPFS hash
  transcription: string
}
```

## 🤖 AI Features

### Schedule Generation
- Analyzes user profile (age, gender, weight, goals, sleep schedule)
- Generates personalized fasting windows (14:10, 16:8, 18:6, OMAD)
- Provides progression plans and success tips

### Daily Check-ins
- Interactive conversations about fasting progress
- Real-time schedule adjustments based on user feedback
- Motivational support and guidance

### Voice Transcription
- Automatic speech-to-text using OpenAI Whisper
- Support for multiple audio formats
- Journal entry analysis and insights

## 💳 Subscription Plans

### Free Plan
- Basic fasting timer
- Limited AI suggestions (5 per month)
- Basic progress tracking
- 30-day history

### Premium Plan
- **Monthly**: $9.99/month
- **Yearly**: $99.99/year (2 months free)
- Unlimited AI interactions
- Voice journaling with transcription
- Advanced analytics
- IPFS audio storage
- Data export

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for React
- Prettier for code formatting
- Tailwind CSS for styling

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Verify your Firebase configuration in `.env.local`
   - Check Firebase project settings and API keys

2. **OpenAI API Errors**
   - Ensure your OpenAI API key is valid and has sufficient credits
   - Check API rate limits

3. **Audio Recording Not Working**
   - Verify microphone permissions in browser
   - Check if HTTPS is enabled (required for audio recording)

4. **Stripe Payment Issues**
   - Verify Stripe publishable key
   - Ensure webhook endpoints are configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities and Whisper transcription
- Firebase for backend infrastructure
- Stripe for payment processing
- Pinata for IPFS storage
- The React and Vite communities

## 📞 Support

For support, email support@fastiflow.com or create an issue in this repository.

---

Built with ❤️ by the FastiFlow team
