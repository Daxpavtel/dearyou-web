import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PersonalizationForm = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const totalSteps = 7;

  const [formData, setFormData] = useState({
    // Section 1
    currentState: '',
    currentFeeling: '',
    // Section 2
    mainGoal: '',
    goalImportance: '',
    futureIdentity: '',
    // Section 3
    obstacles: [],
    removeForever: '',
    // Section 4
    motivationType: '',
    closestSentence: '',
    // Section 5
    aesthetic: '',
    wantPhoto: '',
    affirmationStyle: '',
    // Section 6
    guideStyle: '',
    writingAmount: '',
    tonePreference: '',
    // Section 7
    futureSelfMessage: '',
    name: '',
    personalBelief: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleObstacle = (obstacle) => {
    setFormData(prev => ({
      ...prev,
      obstacles: prev.obstacles.includes(obstacle)
        ? prev.obstacles.filter(o => o !== obstacle)
        : [...prev.obstacles, obstacle]
    }));
  };

  const isObstacleChecked = (obstacle) => {
    return formData.obstacles.includes(obstacle);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API}/submit-journal`, formData);
      toast({
        title: 'Success!',
        description: response.data.message || 'Your journal request has been sent!',
      });
      setTimeout(() => {
        onClose();
        setCurrentStep(1);
        setFormData({
          currentState: '',
          currentFeeling: '',
          mainGoal: '',
          goalImportance: '',
          futureIdentity: '',
          obstacles: [],
          removeForever: '',
          motivationType: '',
          closestSentence: '',
          aesthetic: '',
          wantPhoto: '',
          affirmationStyle: '',
          guideStyle: '',
          writingAmount: '',
          tonePreference: '',
          futureSelfMessage: '',
          name: '',
          personalBelief: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0f1419] border border-[#d4af37]/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-[#d4af37]/20 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-[#f5f1e8] flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#d4af37]" />
              Personalize Your Journal
            </h2>
            <p className="text-sm text-gray-400 mt-1">Step {currentStep} of {totalSteps}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Section 1: Identity Snapshot */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-xl font-serif text-[#f5f1e8] mb-2">Identity Snapshot</h3>
                <p className="text-gray-400 text-sm">Let's understand where you are right now</p>
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">What describes your current state best?</Label>
                <RadioGroup value={formData.currentState} onValueChange={(val) => updateFormData('currentState', val)}>
                  {['calm', 'confused', 'excited', 'stuck', 'building momentum', 'healing', 'growing', 'reborn'].map(state => (
                    <div key={state} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300">
                      <RadioGroupItem value={state} id={state} className="border-[#d4af37]" />
                      <Label htmlFor={state} className="text-gray-300 cursor-pointer capitalize flex-1">{state}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feeling" className="text-[#f5f1e8]">How do you feel about where you are in life right now?</Label>
                <Textarea
                  id="feeling"
                  value={formData.currentFeeling}
                  onChange={(e) => updateFormData('currentFeeling', e.target.value)}
                  placeholder="Describe your current emotional state in one sentence..."
                  className="bg-[#1a2029] border-[#d4af37]/20 text-white placeholder:text-gray-500 min-h-24 transition-all duration-300 focus:border-[#d4af37]/50"
                />
              </div>
            </div>
          )}

          {/* Section 2: The Goal / Future Self */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-xl font-serif text-[#f5f1e8] mb-2">The Goal / Future Self</h3>
                <p className="text-gray-400 text-sm">Clarity for your affirmation themes</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal" className="text-[#f5f1e8]">What is the ONE main goal you want to accomplish in the next 90 days?</Label>
                <Textarea
                  id="goal"
                  value={formData.mainGoal}
                  onChange={(e) => updateFormData('mainGoal', e.target.value)}
                  placeholder="Be specific about your main goal..."
                  className="bg-[#1a2029] border-[#d4af37]/20 text-white placeholder:text-gray-500 min-h-24 transition-all duration-300 focus:border-[#d4af37]/50"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">Why is this goal important to you?</Label>
                <RadioGroup value={formData.goalImportance} onValueChange={(val) => updateFormData('goalImportance', val)}>
                  {[
                    'Because it will change my life',
                    'Because I\'m tired of procrastinating',
                    'Because it defines my future identity',
                    'Because I want to prove something to myself',
                    'Because it\'s my dream'
                  ].map(reason => (
                    <div key={reason} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300">
                      <RadioGroupItem value={reason} id={reason} className="border-[#d4af37]" />
                      <Label htmlFor={reason} className="text-gray-300 cursor-pointer flex-1">{reason}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identity" className="text-[#f5f1e8]">Who do you want to become while achieving this goal?</Label>
                <Input
                  id="identity"
                  value={formData.futureIdentity}
                  onChange={(e) => updateFormData('futureIdentity', e.target.value)}
                  placeholder="e.g., disciplined, peaceful, fearless, confident..."
                  className="bg-[#1a2029] border-[#d4af37]/20 text-white placeholder:text-gray-500 transition-all duration-300 focus:border-[#d4af37]/50"
                />
              </div>
            </div>
          )}

          {/* Section 3: Obstacles & Patterns */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-xl font-serif text-[#f5f1e8] mb-2">Obstacles & Patterns</h3>
                <p className="text-gray-400 text-sm">So affirmations are accurate — not random</p>
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">What usually stops you or pulls you backward? (Select all that apply)</Label>
                <div className="space-y-3">
                  {[
                    'Overthinking',
                    'Fear',
                    'Laziness',
                    'Distractions',
                    'Low confidence',
                    'Lack of clarity',
                    'Mood swings',
                    'Inconsistency'
                  ].map((obstacle, idx) => {
                    const checked = isObstacleChecked(obstacle);
                    return (
                      <div
                        key={obstacle}
                        onClick={() => toggleObstacle(obstacle)}
                        className={`checkbox-wrapper flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                          checked
                            ? 'border-[#d4af37] bg-[#d4af37]/15 checked'
                            : 'border-[#d4af37]/20 hover:border-[#d4af37]/40'
                        } animate-fade-in-up stagger-${idx + 1}`}
                      >
                        <div className="relative flex items-center">
                          <Checkbox
                            id={obstacle}
                            checked={checked}
                            onCheckedChange={() => toggleObstacle(obstacle)}
                            className="border-[#d4af37] data-[state=checked]:bg-[#d4af37] data-[state=checked]:border-[#d4af37]"
                          />
                        </div>
                        <Label htmlFor={obstacle} className="text-gray-300 cursor-pointer flex-1 font-medium">
                          {obstacle}
                        </Label>
                        {checked && (
                          <Check className="w-5 h-5 text-[#d4af37] animate-scale-in" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {formData.obstacles.length > 0 && (
                  <div className="mt-3 p-3 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg animate-fade-in">
                    <p className="text-sm text-[#d4af37]">
                      Selected: {formData.obstacles.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="remove" className="text-[#f5f1e8]">If your future self could remove ONE thing from your life forever, what would it be?</Label>
                <Textarea
                  id="remove"
                  value={formData.removeForever}
                  onChange={(e) => updateFormData('removeForever', e.target.value)}
                  placeholder="What holds you back the most?"
                  className="bg-[#1a2029] border-[#d4af37]/20 text-white placeholder:text-gray-500 min-h-24 transition-all duration-300 focus:border-[#d4af37]/50"
                />
              </div>
            </div>
          )}

          {/* Section 4: Emotional Anchors */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-xl font-serif text-[#f5f1e8] mb-2">Emotional Anchors</h3>
                <p className="text-gray-400 text-sm">Personalize tone + intensity of affirmations</p>
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">What motivates you more?</Label>
                <RadioGroup value={formData.motivationType} onValueChange={(val) => updateFormData('motivationType', val)}>
                  {[
                    'Gentle support and positivity',
                    'Tough reminders and discipline',
                    'A mix of both'
                  ].map(type => (
                    <div key={type} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300">
                      <RadioGroupItem value={type} id={type} className="border-[#d4af37]" />
                      <Label htmlFor={type} className="text-gray-300 cursor-pointer flex-1">{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">Which sentence feels closer to you?</Label>
                <RadioGroup value={formData.closestSentence} onValueChange={(val) => updateFormData('closestSentence', val)}>
                  {[
                    'I am becoming my best self.',
                    'I\'m done playing small.',
                    'I choose peace.',
                    'My future self deserves this.',
                    'I am unstoppable.'
                  ].map(sentence => (
                    <div key={sentence} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300">
                      <RadioGroupItem value={sentence} id={sentence} className="border-[#d4af37]" />
                      <Label htmlFor={sentence} className="text-gray-300 cursor-pointer flex-1">{sentence}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Section 5: Personalization Details */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-xl font-serif text-[#f5f1e8] mb-2">Personalization Details</h3>
                <p className="text-gray-400 text-sm">Visual aesthetic and style preferences</p>
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">Which energy defines your journal aesthetic?</Label>
                <RadioGroup value={formData.aesthetic} onValueChange={(val) => updateFormData('aesthetic', val)}>
                  {[
                    'Minimal calm moon',
                    'Cosmic futuristic',
                    'Black bold warrior',
                    'Elegant gold divine',
                    'Pastel soft healing',
                    'Dark galaxy alignment'
                  ].map(aesthetic => (
                    <div key={aesthetic} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300">
                      <RadioGroupItem value={aesthetic} id={aesthetic} className="border-[#d4af37]" />
                      <Label htmlFor={aesthetic} className="text-gray-300 cursor-pointer flex-1">{aesthetic}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">Do you want your future-self photo generated on the cover?</Label>
                <RadioGroup value={formData.wantPhoto} onValueChange={(val) => updateFormData('wantPhoto', val)}>
                  {['Yes', 'No', 'I want both options to compare'].map(option => (
                    <div key={option} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300">
                      <RadioGroupItem value={option} id={option} className="border-[#d4af37]" />
                      <Label htmlFor={option} className="text-gray-300 cursor-pointer flex-1">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">Which affirmation style do you prefer?</Label>
                <RadioGroup value={formData.affirmationStyle} onValueChange={(val) => updateFormData('affirmationStyle', val)}>
                  {[
                    'Short (2–5 words)',
                    'Medium (one line)',
                    'Paragraph style (like scripts/messages)'
                  ].map(style => (
                    <div key={style} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300">
                      <RadioGroupItem value={style} id={style} className="border-[#d4af37]" />
                      <Label htmlFor={style} className="text-gray-300 cursor-pointer flex-1">{style}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Section 6: Ritual Style */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-xl font-serif text-[#f5f1e8] mb-2">Ritual Style</h3>
                <p className="text-gray-400 text-sm">How you'll use your journal daily</p>
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">How do you want your journal to guide you:</Label>
                <RadioGroup value={formData.guideStyle} onValueChange={(val) => updateFormData('guideStyle', val)}>
                  {['Daily prompts', 'Weekly reflection', 'Both'].map(style => (
                    <div key={style} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300">
                      <RadioGroupItem value={style} id={style} className="border-[#d4af37]" />
                      <Label htmlFor={style} className="text-gray-300 cursor-pointer flex-1">{style}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">How much writing do you enjoy?</Label>
                <RadioGroup value={formData.writingAmount} onValueChange={(val) => updateFormData('writingAmount', val)}>
                  {['Few sentences', 'Full page', 'Depends on the day'].map(amount => (
                    <div key={amount} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300">
                      <RadioGroupItem value={amount} id={amount} className="border-[#d4af37]" />
                      <Label htmlFor={amount} className="text-gray-300 cursor-pointer flex-1">{amount}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-[#f5f1e8]">Choose your frequency reminder message tone:</Label>
                <RadioGroup value={formData.tonePreference} onValueChange={(val) => updateFormData('tonePreference', val)}>
                  {['Soft + gentle', 'Bold + direct', 'Balanced + realistic'].map(tone => (
                    <div key={tone} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-[#d4af37]/5 transition-all duration-300">
                      <RadioGroupItem value={tone} id={tone} className="border-[#d4af37]" />
                      <Label htmlFor={tone} className="text-gray-300 cursor-pointer flex-1">{tone}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Section 7: Final Personal Touch */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-xl font-serif text-[#f5f1e8] mb-2">Final Personal Touch</h3>
                <p className="text-gray-400 text-sm">Make this journal uniquely yours</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="futureMessage" className="text-[#f5f1e8]">If your future self could say ONE sentence to you right now — what would it be?</Label>
                <Textarea
                  id="futureMessage"
                  value={formData.futureSelfMessage}
                  onChange={(e) => updateFormData('futureSelfMessage', e.target.value)}
                  placeholder="What wisdom would your future self share?"
                  className="bg-[#1a2029] border-[#d4af37]/20 text-white placeholder:text-gray-500 min-h-24 transition-all duration-300 focus:border-[#d4af37]/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#f5f1e8]">Name to print inside the journal (optional)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Your name"
                  className="bg-[#1a2029] border-[#d4af37]/20 text-white placeholder:text-gray-500 transition-all duration-300 focus:border-[#d4af37]/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="belief" className="text-[#f5f1e8]">Add any personal belief, quote, or word you want included (optional)</Label>
                <Textarea
                  id="belief"
                  value={formData.personalBelief}
                  onChange={(e) => updateFormData('personalBelief', e.target.value)}
                  placeholder="A mantra, quote, or word that means everything to you..."
                  className="bg-[#1a2029] border-[#d4af37]/20 text-white placeholder:text-gray-500 min-h-24 transition-all duration-300 focus:border-[#d4af37]/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-[#d4af37]/20 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="text-gray-400 hover:text-white transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-medium transition-all duration-300"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#d4af37] to-[#c9a961] hover:from-[#c9a961] hover:to-[#d4af37] text-black font-medium transition-all duration-300"
            >
              {isSubmitting ? 'Submitting...' : 'Complete & Submit'}
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalizationForm;
