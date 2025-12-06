// Mock data for DearYou landing page

export const mockFormSubmission = async (formData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log('Form submitted with data:', formData);
  
  return {
    success: true,
    message: 'Your personalized journal is being created!',
    orderId: `DJ-${Date.now()}`
  };
};

export const mockEmailSignup = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Email signup:', email);
  
  return {
    success: true,
    message: 'You\'re on the list for early access!'
  };
};

export const mockTestimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Student',
    text: 'I used to restart my goals every Monday. This journal changed everything.'
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Entrepreneur',
    text: 'Seeing my affirmation every day made it real. I actually became that person.'
  },
  {
    id: 3,
    name: 'Amelia Grant',
    role: 'Creative',
    text: 'It\'s not just a journal. It\'s a daily reminder of who I\'m becoming.'
  }
];
