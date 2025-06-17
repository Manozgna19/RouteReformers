
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Star, Send, MessageSquare, ThumbsUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');
  const [studentName, setStudentName] = useState('');
  const [college, setCollege] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && feedbackType && message.trim()) {
      setSubmitted(true);
      console.log('Feedback submitted:', { rating, feedbackType, message, studentName, college });
    }
  };

  const recentFeedback = [
    {
      id: 1,
      name: 'Arjun Sharma',
      college: 'JNTU Hyderabad',
      rating: 5,
      message: 'BusOptim helped me save 45 minutes daily! The TSRTC route suggestions are accurate.',
      date: '2 days ago'
    },
    {
      id: 2,
      name: 'Priya Patel',
      college: 'MIT World Peace University',
      rating: 4,
      message: 'Love the eco-friendly route options. PMPML buses are well covered. Need more real-time updates.',
      date: '1 week ago'
    },
    {
      id: 3,
      name: 'Rohit Kumar',
      college: 'RV College of Engineering',
      rating: 5,
      message: 'The cost optimization feature is perfect for student budget! BMTC routes are spot-on.',
      date: '2 weeks ago'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      college: 'CVR College of Engineering',
      rating: 4,
      message: 'Very helpful for daily commute from Secunderabad. Would love to see more route options.',
      date: '3 weeks ago'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      college: 'VJTI Mumbai',
      rating: 5,
      message: 'BEST bus integration is excellent! Never missed college because of wrong routes anymore.',
      date: '1 month ago'
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your feedback helps us make BusOptim better for all Indian students.</p>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">BusOptim</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/planner" className="text-gray-600 hover:text-blue-600 transition-colors">Route Planner</Link>
              <Link to="/map" className="text-gray-600 hover:text-blue-600 transition-colors">Map View</Link>
              <Link to="/timetable" className="text-gray-600 hover:text-blue-600 transition-colors">Timetables</Link>
              <Link to="/feedback" className="text-blue-600 font-semibold">Feedback</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Share Your Feedback</h1>
          <p className="text-xl text-gray-600">Help us improve BusOptim for all Indian college students</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <span>Tell Us What You Think</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How would you rate BusOptim?
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className="focus:outline-none transition-colors"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name (Optional)
                    </label>
                    <Input
                      placeholder="Your name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      College
                    </label>
                    <Select value={college} onValueChange={setCollege}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your college" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cvr-college">CVR College of Engineering</SelectItem>
                        <SelectItem value="jntu-hyderabad">JNTU Hyderabad</SelectItem>
                        <SelectItem value="mit-world-peace">MIT World Peace University</SelectItem>
                        <SelectItem value="coep">College of Engineering Pune</SelectItem>
                        <SelectItem value="vjti">VJTI Mumbai</SelectItem>
                        <SelectItem value="rv-college">RV College of Engineering</SelectItem>
                        <SelectItem value="bms-college">BMS College of Engineering</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Type
                  </label>
                  <Select value={feedbackType} onValueChange={setFeedbackType}>
                    <SelectTrigger>
                      <SelectValue placeholder="What type of feedback?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature-request">Feature Request</SelectItem>
                      <SelectItem value="bug-report">Bug Report</SelectItem>
                      <SelectItem value="route-accuracy">Route Accuracy</SelectItem>
                      <SelectItem value="general-feedback">General Feedback</SelectItem>
                      <SelectItem value="ui-improvement">UI/UX Improvement</SelectItem>
                      <SelectItem value="bus-operator">Bus Operator Coverage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <Textarea
                    placeholder="Tell us about your experience, route suggestions, or any issues with Indian bus services..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                  disabled={rating === 0 || !feedbackType || !message.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Feedback & Stats */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4.6/5</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">1,250</div>
                    <div className="text-sm text-gray-600">Student Reviews</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">85</div>
                    <div className="text-sm text-gray-600">Colleges Covered</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">96%</div>
                    <div className="text-sm text-gray-600">Route Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span>Recent Student Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800">{feedback.name}</span>
                        <span className="text-sm text-gray-600">• {feedback.college}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(feedback.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-1">{feedback.message}</p>
                    <p className="text-xs text-gray-500">{feedback.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Join Our Community</h3>
                <p className="mb-4 opacity-90">
                  Connect with fellow students and help improve bus routes across India.
                </p>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
