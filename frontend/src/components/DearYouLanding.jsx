import React, { useState } from 'react';
import { Star, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import PersonalizationForm from './PersonalizationForm';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DearYouLanding = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const { toast } = useToast();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!email) return;

    setEmailLoading(true);
    try {
      const response = await axios.post(`${API}/email-signup`, { email });
      toast({
        title: 'Success!',
        description: response.data.message || 'You\'re on the list for early access!',
      });
      setEmail('');
    } catch (error) {
      console.error('Email signup error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f1419]/80 backdrop-blur-md border-b border-[#d4af37]/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_identity-tools/artifacts/lpn8t8z1_Gemini_Generated_Image_4zta544zta544zta.png" 
              alt="DearYou Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-serif text-[#f5f1e8]">DearYou</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('product')} className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors">The Journal</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors">How It Works</button>
            <button onClick={() => scrollToSection('faq')} className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors">FAQ</button>
          </nav>
          <Button
            onClick={() => setFormOpen(true)}
            className="bg-[#d4af37] hover:bg-[#c9a961] text-black font-medium"
          >
            Start Your Journal
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1679615845580-8691c78fd7d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBzdGFycyUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzY1MDE4MTUxfDA&ixlib=rb-4.1.0&q=85"
            alt="Cosmic background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full">
                <Star className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm text-[#d4af37]">Personalized Identity Journals</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif text-[#f5f1e8] leading-tight">
                Become Who You're Meant to Be.
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                A personalized identity journal designed to keep your goals in front of you — so you never forget what you're becoming.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setFormOpen(true)}
                  size="lg"
                  className="bg-[#d4af37] hover:bg-[#c9a961] text-black font-medium text-lg px-8 group"
                >
                  Start Your Journal
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => scrollToSection('how-it-works')}
                  size="lg"
                  variant="outline"
                  className="border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10 text-lg px-8"
                >
                  How It Works
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#d4af37]" />
                  <span className="text-sm text-gray-400">Custom cover with your identity phrase</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#d4af37]" />
                  <span className="text-sm text-gray-400">Vision page for your dream life</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#d4af37]" />
                  <span className="text-sm text-gray-400">One affirmation repeated on every page</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#d4af37]/20 blur-3xl rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1572129063426-fb1ad9ed15de?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwam91cm5hbCUyMG1vY2t1cHxlbnwwfHx8fDE3NjUwMTgxNTZ8MA&ixlib=rb-4.1.0&q=85"
                alt="DearYou Journal"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif text-[#f5f1e8]">
            Motivated Today. Forgotten Next Month.
          </h2>
          <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
            <p>
              You set goals. You get inspired. You make plans.<br />
              And then life happens — distractions, stress, routine — and slowly the dream fades.
            </p>
            <p>
              Not because you don't want it.<br />
              But because you stop seeing it.
            </p>
            <p>
              When the vision disappears from your daily environment, your brain forgets the direction.
            </p>
            <p className="font-medium">And you restart again… and again.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {[
              'You set big goals but lose momentum.',
              'You try journaling but stop after a week.',
              'You save motivation but don\'t act on it.'
            ].map((point, idx) => (
              <div key={idx} className="p-6 bg-[#1a2029] border border-[#d4af37]/20 rounded-xl">
                <p className="text-gray-300">{point}</p>
              </div>
            ))}
          </div>

          <p className="text-xl text-[#d4af37] font-medium pt-8">
            That's exactly the problem DearYou exists to solve.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-[#1a2029]">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span className="text-sm text-[#d4af37]">The Solution</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#f5f1e8]">
            Tools That Help You Remember Your Future.
          </h2>
          <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
            <p>
              DearYou creates personalized journals that act as identity reminders.<br />
              Instead of random quotes or unused pages, each journal is carefully designed around one thing:
            </p>
            <p className="text-2xl text-[#d4af37] font-medium">
              ➡️ Keeping you connected to your future self — every single day.
            </p>
            <div className="space-y-2 pt-4">
              <p className="text-[#f5f1e8]">No overwhelm.</p>
              <p className="text-[#f5f1e8]">No complication.</p>
              <p className="text-[#f5f1e8]">Just daily alignment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#f5f1e8] mb-4">
              The DearYou Identity Journal
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A 50-page personalized journal built around your goal, your identity and your future self. Each page begins with the same affirmation — the one aligned to who you are becoming — so repetition can rewire your subconscious.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1657879005659-e0063bf20f42?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxlbGVnYW50JTIwam91cm5hbCUyMG1vY2t1cHxlbnwwfHx8fDE3NjUwMTgxNTZ8MA&ixlib=rb-4.1.0&q=85"
                alt="Journal cover"
                className="rounded-xl shadow-lg col-span-2"
              />
              <img
                src="https://images.unsplash.com/photo-1611850749233-e23afe2fcaae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxlbGVnYW50JTIwam91cm5hbCUyMG1vY2t1cHxlbnwwfHx8fDE3NjUwMTgxNTZ8MA&ixlib=rb-4.1.0&q=85"
                alt="Journal detail 1"
                className="rounded-xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1572129063426-fb1ad9ed15de?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwam91cm5hbCUyMG1vY2t1cHxlbnwwfHx8fDE3NjUwMTgxNTZ8MA&ixlib=rb-4.1.0&q=85"
                alt="Journal detail 2"
                className="rounded-xl shadow-lg"
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                {[
                  { icon: Check, text: 'Personalized cover with your name and identity phrase' },
                  { icon: Check, text: 'A guided Vision Page to define the future you\'re working toward' },
                  { icon: Check, text: 'One powerful affirmation printed on every page header' },
                  { icon: Check, text: 'Minimal, calming design for clear thinking' },
                  { icon: Check, text: 'Printed one-by-one — no two journals are the same' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <feature.icon className="w-6 h-6 text-[#d4af37] flex-shrink-0 mt-1" />
                    <span className="text-gray-300 text-lg">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl">
                <p className="text-sm text-gray-400 italic">
                  Each journal is made one-by-one based on your answers. No two are the same.
                </p>
              </div>

              <Button
                onClick={() => setFormOpen(true)}
                size="lg"
                className="w-full bg-[#d4af37] hover:bg-[#c9a961] text-black font-medium text-lg"
              >
                Create My Journal
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-[#1a2029]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#f5f1e8] mb-4">
              Your Journal Is Built in Four Simple Steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                step: '1',
                title: 'Answer a short form',
                description: 'Share your goal, struggle and the kind of person you want to become.'
              },
              {
                step: '2',
                title: 'We create your affirmation',
                description: 'Based on your answers, we choose one identity-based affirmation.'
              },
              {
                step: '3',
                title: 'We personalize and print your journal',
                description: 'Your cover, your vision page, your repeated affirmation — all aligned to you.'
              },
              {
                step: '4',
                title: 'Use it daily for 50 days',
                description: 'One page. One affirmation. One aligned action. Repetition becomes identity.'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative p-8 bg-[#0f1419] border border-[#d4af37]/20 rounded-2xl hover:border-[#d4af37]/50 transition-all group">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#d4af37] text-black rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-2xl font-serif text-[#f5f1e8] mb-3 mt-2">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => setFormOpen(true)}
              size="lg"
              className="bg-[#d4af37] hover:bg-[#c9a961] text-black font-medium text-lg px-8"
            >
              Fill the Personalization Form
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif text-[#f5f1e8]">
            This Isn't Magic — It's Psychology.
          </h2>
          <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
            <p>
              The subconscious mind doesn't change because you read something once.<br />
              It changes because you see the same message repeatedly.
            </p>
            <p>
              When your environment reminds you of your future —<br />
              your brain begins acting like it's already yours.
            </p>
            <p className="text-[#f5f1e8] text-xl">
              That's how identity shifts.<br />
              And identity is what creates results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12">
            {[
              { icon: Star, title: 'Daily repetition', description: 'See your affirmation every single day' },
              { icon: Sparkles, title: 'Identity-based affirmation', description: 'Aligned to who you\'re becoming' },
              { icon: Star, title: 'Consistent visual reminders', description: 'Your environment shapes your mind' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-[#1a2029] border border-[#d4af37]/20 rounded-xl hover:border-[#d4af37]/50 transition-all">
                <item.icon className="w-10 h-10 text-[#d4af37] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-[#f5f1e8] mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 px-4 bg-[#1a2029]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#f5f1e8] mb-4">
              If You've Ever Said: "I Know What I Want, I Just Can't Stay Consistent"…
            </h2>
            <p className="text-2xl text-[#d4af37]">This Is for You.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Students preparing for exams',
              'Creators & entrepreneurs',
              'Gym and fitness discipline',
              'People working on confidence',
              'Anyone wanting emotional stability',
              'Anyone tired of restarting'
            ].map((category, idx) => (
              <div key={idx} className="p-6 bg-[#0f1419] border border-[#d4af37]/20 rounded-xl text-center hover:border-[#d4af37]/50 transition-all group">
                <p className="text-lg text-gray-300 group-hover:text-[#d4af37] transition-colors">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#f5f1e8] mb-4">
              A Glimpse Inside
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1522794338816-ee3a17a00ae8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxvcGVuJTIwam91cm5hbCUyMHBhZ2VzfGVufDB8fHx8MTc2NTAxODE2MXww&ixlib=rb-4.1.0&q=85"
                alt="Journal pages"
                className="rounded-xl shadow-lg"
              />
              <p className="text-center text-gray-400 text-sm">Cover with your identity phrase</p>
            </div>
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1761322572550-967ea8c0bfd9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvcGVuJTIwam91cm5hbCUyMHBhZ2VzfGVufDB8fHx8MTc2NTAxODE2MXww&ixlib=rb-4.1.0&q=85"
                alt="Vision page"
                className="rounded-xl shadow-lg"
              />
              <p className="text-center text-gray-400 text-sm">Clean daily writing space with your affirmation at the top</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 px-4 bg-[#1a2029]">
        <div className="container mx-auto max-w-3xl text-center space-y-8">
          <Sparkles className="w-12 h-12 text-[#d4af37] mx-auto" />
          <h2 className="text-3xl md:text-4xl font-serif text-[#f5f1e8]">
            Identity Kits Coming Soon.
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Soon, you'll be able to pair your journal with personalized accessories like identity lockets, stickers and keychains — all designed around your future self.
          </p>
          <p className="text-gray-400">
            For now, we're focused on perfecting the journal experience.
          </p>
          <form onSubmit={handleEmailSignup} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="bg-[#0f1419] border-[#d4af37]/20 text-white placeholder:text-gray-500"
              required
            />
            <Button
              type="submit"
              disabled={emailLoading}
              className="bg-[#d4af37] hover:bg-[#c9a961] text-black font-medium whitespace-nowrap"
            >
              {emailLoading ? 'Submitting...' : 'Get Early Access'}
            </Button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#f5f1e8] mb-4">
              Questions?
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-[#1a2029] border border-[#d4af37]/20 rounded-xl px-6">
              <AccordionTrigger className="text-[#f5f1e8] hover:text-[#d4af37] text-left">
                How is this different from a normal journal?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Every page has your personalized affirmation, so repetition helps reprogram your identity. It's not just blank pages — it's a daily reminder system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-[#1a2029] border border-[#d4af37]/20 rounded-xl px-6">
              <AccordionTrigger className="text-[#f5f1e8] hover:text-[#d4af37] text-left">
                What if I'm unsure about my goal?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                The form helps you clarify it. Even a direction is enough to start. The journal is designed to help you discover clarity through the process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-[#1a2029] border border-[#d4af37]/20 rounded-xl px-6">
              <AccordionTrigger className="text-[#f5f1e8] hover:text-[#d4af37] text-left">
                Is this spiritual?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                No — this is grounded in psychology, identity and repetition. Anyone can use it, regardless of beliefs or background.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-[#1a2029] border border-[#d4af37]/20 rounded-xl px-6">
              <AccordionTrigger className="text-[#f5f1e8] hover:text-[#d4af37] text-left">
                Can I gift this to someone?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Yes. Personalized journals make meaningful and unforgettable gifts for friends, family, or anyone starting a new chapter.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-[#1a2029] border border-[#d4af37]/20 rounded-xl px-6">
              <AccordionTrigger className="text-[#f5f1e8] hover:text-[#d4af37] text-left">
                How long does delivery take?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                5–10 days because each journal is made individually and personalized just for you.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1679706292806-3a7d5eb2dd75?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxjb3NtaWMlMjBzdGFycyUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzY1MDE4MTUxfDA&ixlib=rb-4.1.0&q=85"
            alt="Cosmic background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto max-w-3xl text-center relative z-10 space-y-8">
          <h2 className="text-5xl md:text-6xl font-serif text-[#f5f1e8] leading-tight">
            Your Future Self Is Already Waiting.
          </h2>
          <p className="text-2xl text-gray-400">
            Start showing up for them today.
          </p>
          <Button
            onClick={() => setFormOpen(true)}
            size="lg"
            className="bg-[#d4af37] hover:bg-[#c9a961] text-black font-medium text-xl px-12 py-6 h-auto"
          >
            Start Your Journal
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#d4af37]/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_identity-tools/artifacts/lpn8t8z1_Gemini_Generated_Image_4zta544zta544zta.png" 
                alt="DearYou Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-serif text-[#f5f1e8]">DearYou</span>
            </div>
            <p className="text-gray-400 text-sm">Personalized Identity Journals</p>
            <p className="text-gray-500 text-sm">© 2025 — All Rights Reserved</p>
          </div>
        </div>
      </footer>

      {/* Personalization Form Modal */}
      <PersonalizationForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
};

export default DearYouLanding;
