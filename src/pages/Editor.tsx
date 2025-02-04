import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Code2, Copy, Save, Share2 } from 'lucide-react';
import MonacoEditor from '@monaco-editor/react';
import { supabase } from '../lib/supabase';

export function Editor() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('// Start coding here...');
  const [language, setLanguage] = useState('javascript');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    const loadSession = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('code, language')
        .eq('id', sessionId)
        .single();

      if (error) {
        // New session, create it
        const { error: insertError } = await supabase
          .from('sessions')
          .insert([
            { id: sessionId, code: code, language: language }
          ]);

        if (insertError) {
          console.error('Error creating session:', insertError);
          setSaveStatus('Error creating session');
        }
      } else if (data) {
        setCode(data.code);
        setLanguage(data.language);
      }
    };

    loadSession();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`session-${sessionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'sessions',
        filter: `id=eq.${sessionId}`,
      }, (payload: any) => {
        if (payload.new.code !== code) {
          setCode(payload.new.code);
        }
        if (payload.new.language !== language) {
          setLanguage(payload.new.language);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleEditorChange = async (value: string | undefined) => {
    if (!value) return;
    
    setCode(value);
    setIsSaving(true);
    setSaveStatus('Saving...');

    const { error } = await supabase
      .from('sessions')
      .update({ code: value })
      .eq('id', sessionId);

    if (error) {
      console.error('Error saving:', error);
      setSaveStatus('Error saving');
    } else {
      setSaveStatus('Saved');
    }

    setIsSaving(false);
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    
    const { error } = await supabase
      .from('sessions')
      .update({ language: newLanguage })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating language:', error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSaveStatus('Link copied!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Code2 className="w-6 h-6" />
              <span className="font-semibold">EditorShare</span>
            </button>
            
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={copyLink}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                       rounded-lg text-white transition-colors focus:outline-none focus:ring-2 
                       focus:ring-blue-400 focus:ring-opacity-50"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            
            <span className={`text-sm ${
              saveStatus === 'Saved' ? 'text-green-400' :
              saveStatus === 'Error saving' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {saveStatus}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <MonacoEditor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
          }}
        />
      </main>
    </div>
  );
}