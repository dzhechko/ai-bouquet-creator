# 🌸 AI Bouquet Creator

An elegant web application that uses AI to help you create perfect flower bouquets for any occasion. Powered by YandexGPT and YandexART (or optionally OpenAI's GPT-4 and DALL-E 3).

![AI Bouquet Creator Demo](demo.gif)

## ✨ Features

- 🎯 **Personalized Bouquets**: Create custom bouquets for specific occasions and recipients
- 🤖 **AI-Powered Suggestions**: Get intelligent flower combinations based on your requirements
- 🎨 **Visual Generation**: See photorealistic previews of your bouquet designs
- 🔄 **Multiple Options**: Generate and compare different bouquet variations
- 🎛️ **Flexible Settings**: Choose between different AI models and customize their behavior
- 📥 **Easy Export**: Download generated bouquet images in high quality

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- YandexGPT API key and Folder ID (or OpenAI API key if using OpenAI mode)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-bouquet-creator.git
   cd ai-bouquet-creator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a .env file in the root directory:
   ```env
   # Enable/disable OpenAI mode (true/false)
   VITE_OPENAI_MODE=false

   # Enable/disable debug logging (true/false)
   DEBUG=false
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open http://localhost:5173 in your browser

### Docker Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-bouquet-creator.git
   cd ai-bouquet-creator
   ```

2. Create a `.env` file in the root directory with your environment variables:
   ```env
   # Enable/disable OpenAI mode (true/false)
   VITE_OPENAI_MODE=false
   # Enable/disable debug logging (true/false)
   DEBUG=false
   # Your Yandex API credentials
   YANDEX_API_KEY=your_api_key_here
   YANDEX_FOLDER_ID=your_folder_id_here
   ```

3. Build and start the containers:
   ```bash
   # Build and start in detached mode
   docker-compose up -d

   # View the logs
   docker-compose logs -f

   # Check container status
   docker-compose ps
   ```

4. Access the application at http://localhost:3000

5. To stop the application:
   ```bash
   docker-compose down
   ```

#### Docker Commands Reference

- Rebuild the application:
  ```bash
  docker-compose build --no-cache
  ```

- Restart the application:
  ```bash
  docker-compose restart
  ```

- View container logs:
  ```bash
  # All logs
  docker-compose logs -f

  # App container logs only
  docker-compose logs -f app
  ```

- Shell into the container:
  ```bash
  docker-compose exec app sh
  ```

## 💻 Usage Guide

1. **Initial Setup**
   - Navigate to "AI Settings"
   - Enter your YandexGPT API key and Folder ID
   - (Optional) Configure model settings and prompts

2. **Creating a Bouquet**
   - Enter the occasion and recipient details
   - Choose flowers from suggestions or add custom ones
   - Click "Generate Bouquet" to create your design
   - View and download the generated images

3. **Customization Options**
   - Adjust temperature for more conservative or creative results
   - Modify system prompts for different generation styles
   - Choose between different AI models for text and image generation

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React + TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **API Integration**: Custom Express server

### Project Structure
```
ai-bouquet-creator/
├── src/
│   ├── components/        # React components
│   ├── services/         # API and utility services
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript type definitions
│   └── main.tsx         # Application entry point
├── server.js            # Express server for API proxying
└── public/             # Static assets
```

### Key Components
- **DetailsStep**: Handles initial bouquet information
- **CustomizeStep**: Manages flower selection and AI settings
- **GenerateStep**: Handles AI generation process
- **PreviewStep**: Displays and manages generated results

### Data Flow
1. User input is collected through the step-by-step interface
2. State is managed centrally using Zustand
3. API requests are proxied through the Express server
4. Generated content is displayed and can be downloaded

## 🔧 API Configuration

### YandexGPT & YandexART
- Requires API key and Folder ID
- Supports both text generation and image creation
- Configurable system prompts for both services

### OpenAI (Optional)
- Requires OpenAI API key
- Supports GPT-4/3.5 for text and DALL-E 3/2 for images
- Enable by setting `VITE_OPENAI_MODE=true`

## 🤝 Debugging

The application includes comprehensive logging for both client and server-side operations. To enable debugging:

1. Set `DEBUG=true` in your `.env` file
2. Logs will appear in:
   - Browser console for client-side operations
   - Terminal console for server-side operations
3. Debug information includes:
   - API requests and responses
   - State changes
   - Error details
   - Operation timing

When `DEBUG=false`, all debug logging is disabled for better performance in production.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Yandex Cloud for their powerful AI services
- OpenAI for their optional AI capabilities
- The React and TypeScript communities
- All contributors and users of this project