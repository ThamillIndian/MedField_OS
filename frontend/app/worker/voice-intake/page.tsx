'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function VoiceIntakePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { 
    isRecording, 
    isPaused, 
    recordingTime, 
    audioURL, 
    audioBlob,
    startRecording, 
    stopRecording, 
    pauseRecording, 
    resumeRecording 
  } = useVoiceRecorder();

  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPatientData, setHasPatientData] = useState(false);

  useEffect(() => {
    // Check if patient and vitals data exists
    const patientData = sessionStorage.getItem('currentPatient');
    const vitalsData = sessionStorage.getItem('currentVitals');
    
    if (!patientData || !vitalsData) {
      router.push('/worker/new-visit');
      return;
    }
    
    setHasPatientData(true);
  }, [router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    startRecording();
  };

  const handleStop = () => {
    stopRecording();
  };

  const handlePause = () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  const handleProcessAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    
    try {
      // For demo: Generate mock transcript
      const mockTranscripts = [
        "Patient is complaining of high fever for the last 3 days. Body temperature feels very hot. Also experiencing headache and body pain. No cough or cold symptoms.",
        "Feeling weak and dizzy. Had fever yesterday night which came down with medicine. Still feeling tired. Stomach is upset since morning.",
        "Child is not eating properly for 2 days. Crying a lot and has slight fever. Mother says temperature goes up in the evening.",
      ];
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setTranscript(mockTranscript);
      
      // Store transcript
      sessionStorage.setItem('voiceTranscript', mockTranscript);
      
      alert('✓ Audio processed successfully!\nTranscript has been generated.');
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Failed to process audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (transcript) {
      router.push('/worker/triage-result');
    } else {
      alert('Please record and process audio first, or skip to triage.');
    }
  };

  if (!hasPatientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Voice Intake</h1>
            <p className="text-sm text-gray-600">Record patient conversation</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Recording Card */}
        <Card>
          <CardHeader>
            <CardTitle>Audio Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 space-y-6">
              {/* Visual Feedback */}
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-red-100 animate-pulse' 
                  : audioURL 
                  ? 'bg-green-100' 
                  : 'bg-gray-100'
              }`}>
                <svg 
                  className={`w-16 h-16 ${
                    isRecording 
                      ? 'text-red-600' 
                      : audioURL 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                  />
                </svg>
              </div>

              {/* Timer */}
              {isRecording && (
                <div className="text-3xl font-bold text-red-600">
                  {formatTime(recordingTime)}
                </div>
              )}

              {/* Status Message */}
              <p className="text-gray-600">
                {isRecording 
                  ? (isPaused ? '⏸️ Recording Paused' : '🔴 Recording in progress...') 
                  : audioURL 
                  ? '✓ Recording complete' 
                  : 'Ready to record'}
              </p>

              {/* Control Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                {!isRecording && !audioURL && (
                  <Button 
                    variant="danger"
                    onClick={handleStart}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="6" />
                    </svg>
                    Start Recording
                  </Button>
                )}

                {isRecording && (
                  <>
                    <Button 
                      variant="secondary"
                      onClick={handlePause}
                    >
                      {isPaused ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.841z" />
                          </svg>
                          Resume
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm8 0a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V4z" />
                          </svg>
                          Pause
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="danger"
                      onClick={handleStop}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <rect x="4" y="4" width="12" height="12" rx="2" />
                      </svg>
                      Stop
                    </Button>
                  </>
                )}
              </div>

              {/* Audio Player */}
              {audioURL && !isRecording && (
                <div className="mt-6">
                  <audio 
                    controls 
                    src={audioURL}
                    className="w-full max-w-md mx-auto"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setTranscript('');
                      window.location.reload();
                    }}
                    className="mt-4"
                  >
                    Record Again
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Process Audio Button */}
        {audioURL && !transcript && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent>
              <div className="text-center py-6">
                <p className="text-gray-700 mb-4">Audio recorded successfully! Process it to extract symptoms.</p>
                <Button
                  variant="primary"
                  onClick={handleProcessAudio}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    '🎤 Process Audio with AI'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transcript Display */}
        {transcript && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="secondary"
            className="flex-1"
            onClick={() => router.back()}
          >
            Back to Vitals
          </Button>
          
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/worker/triage-result')}
          >
            Skip to Triage (Demo)
          </Button>
          
          <Button 
            variant="primary"
            className="flex-1"
            onClick={handleContinue}
            disabled={!transcript && !audioURL}
          >
            Continue to Triage
          </Button>
        </div>

        {/* Instructions */}
        <Card>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-semibold text-gray-800">📝 Instructions:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Click "Start Recording" and speak about patient symptoms</li>
                <li>Describe complaints in any language (Hindi, English, etc.)</li>
                <li>Click "Stop" when finished</li>
                <li>Click "Process Audio" to extract symptoms using AI</li>
                <li>Or skip to triage for demo with mock data</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
