import { useNavigate } from 'react-router-dom';
import { Code2, Github, Share2, Users, Zap } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function Home() {
  const navigate = useNavigate();

  const startCoding = () => {
    const sessionId = uuidv4();
    navigate(`/session/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <nav className="py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Code2 className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">EditorShare</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </a>
        </nav>

        <main className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Code Together, Instantly
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Real-time collaborative code editor. No signup required.
              Share your code with anyone, anywhere, instantly.
            </p>
            <button
              onClick={startCoding}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold 
                       transition-all transform hover:scale-105 focus:outline-none focus:ring-2 
                       focus:ring-blue-400 focus:ring-opacity-50 shadow-lg"
            >
              Start Coding Now
            </button>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Instant Setup"
              description="No registration required. Start coding in seconds."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-green-400" />}
              title="Real-time Collaboration"
              description="Code together with your team. See changes as they happen."
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6 text-purple-400" />}
              title="Easy Sharing"
              description="Share your code with a simple link. That's it."
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-gray-600 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}