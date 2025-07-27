import React, { useEffect, useState, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { loadProductsAndEmbeddings, getQueryEmbedding, cosineSimilarity } from '../lib/semanticsearch';

const faqAnswers: Record<string, string> = {
  'how do i order': 'Just add products to your cart and proceed to checkout!',
  'what is your return policy': 'We offer a 30-day return policy on all items.',
  'how can i contact support': 'You can reach us via the chat or our contact page.',
  'do you offer free shipping': 'Yes! Orders over $50 get free shipping.',
};

function getBotResponse(input: string): string {
  const text = input.toLowerCase();
  if (text.includes('hello') || text.includes('hi')) return 'Hello! How can I help you today?';
  if (text.includes('order')) return faqAnswers['how do i order'];
  if (text.includes('return')) return faqAnswers['what is your return policy'];
  if (text.includes('contact')) return faqAnswers['how can i contact support'];
  if (text.includes('shipping')) return faqAnswers['do you offer free shipping'];
  if (text.includes('recommend')) {
    return "I'm sorry, I don't have access to product data in this context.";
  }
  if (text.includes('category')) {
    return "I'm sorry, I don't have access to category data in this context.";
  }
  return "I'm here to help! You can ask about orders or ask for a recommendation.";
}

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ from: string; text?: string; product?: any }>>([
    { from: 'bot', text: 'Hi! I am your AI shopping assistant. How can I help you today?' }
  ]);
  const [products, setProducts] = useState<any[]>([]);
  const [embeddings, setEmbeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [lastIntent, setLastIntent] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    loadProductsAndEmbeddings()
      .then(({ products, embeddings }) => {
        setProducts(products);
        setEmbeddings(embeddings);
        setLoading(false);
        if (products.length === 0) {
          setMessages(prev => [...prev, { from: 'bot', text: 'No products available at the moment.' }]);
        }
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setLoading(false);
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: 'Sorry, I had trouble loading product data. You can still ask general questions.' 
        }]);
      });
  }, []);

  useEffect(() => {
    if (open && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, open]);

  const getFallbackRecommendations = (query: string, products: any[]) => {
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(' ').filter(word => word.length > 2);
    
    const scored = products.map(product => {
      const productText = [
        product.ProductName || '',
        product.Description || '',
        product.ProductBrand || '',
        product.Gender || '',
        product.PrimaryColor || ''
      ].join(' ').toLowerCase();
      
      let score = 0;
      keywords.forEach(keyword => {
        if (productText.includes(keyword)) {
          score += 1;
        }
      });
      
      return { ...product, score };
    });
    
    const top = scored
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    
    return top;
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    const userMsg = { from: 'user', text: trimmedInput };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setTyping(true);

    // Greeting detection
    const greetings = [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'hiya', 'yo', 'greetings'
    ];
    const goodbyes = [
      'bye', 'goodbye', 'see you', 'see ya', 'later', 'farewell', 'catch you', 'take care'
    ];
    const thanks = [
      'thank you', 'thanks', 'thx', 'appreciate it', 'much appreciated', 'thank u', 'ty'
    ];

    const greetingReplies = [
      "Hello! How can I help you today?",
      "Hi there! What can I do for you?",
      "Hey! Need help finding something?",
      "Greetings! How may I assist you?"
    ];
    const goodbyeReplies = [
      "Goodbye! If you need anything else, just open the chat again.",
      "See you next time! Happy shopping!",
      "Take care! I'm here if you need more help.",
      "Bye! Let me know if you have more questions."
    ];
    const thanksReplies = [
      "You're welcome! Let me know if you need anything else.",
      "No problem! Happy to help.",
      "Anytime! If you need more recommendations, just ask.",
      "Glad I could assist! 😊"
    ];

    function randomReply(arr: string[]) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    const inputLower = trimmedInput.toLowerCase();

    if (greetings.some(greet => inputLower.startsWith(greet) || inputLower === greet)) {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: randomReply(greetingReplies) }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    if (goodbyes.some(bye => inputLower.includes(bye))) {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: randomReply(goodbyeReplies) }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    if (thanks.some(thank => inputLower.includes(thank))) {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: randomReply(thanksReplies) }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    if (inputLower.includes('how are you')) {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: "I'm just a bot, but I'm here to help you shop! 😊" }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    if (inputLower.includes('who are you') || inputLower.includes('what are you')) {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: "I'm your AI shopping assistant! Ask me for product recommendations or help with your order." }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    if (
      inputLower.includes('order') ||
      inputLower.includes('buy') ||
      inputLower.includes('purchase') ||
      inputLower.includes('checkout')
    ) {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: "We're not yet open for orders—this is just a prototype! But you can browse products and try out the features." }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    if (inputLower.includes('how is the weather')) {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: "I'm always in the cloud, so every day is a good day for shopping! ☁️🛍️" }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    if (inputLower.includes('joke')) {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: "Why did the shopper bring a ladder to the store? Because they were going to the next level of fashion! 😄" }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    if (inputLower.includes('recommend')) {
      setLastIntent('recommendation');
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: "Sure! Are you shopping for men, women, or something specific?" }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    if (inputLower.includes('😊') || inputLower.includes('😀') || inputLower.includes('😁')) {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: "I love your positive energy! How can I help you today?" }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    if (['yes', 'sure', 'okay', 'ok', 'yep'].includes(inputLower) && lastIntent === 'recommendation') {
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: "Awesome! Are you looking for men's, women's, or unisex products?" }
        ]);
        setTyping(false);
      }, 700);
      return;
    }

    // For recommendations and fallback, show typing while processing
    setMessages(msgs => [...msgs, { from: 'bot', text: 'Let me find some great options for you...' }]);
    
    try {
      const queryEmbedding = await getQueryEmbedding(input);
      
      // Filter out products without valid embeddings
      const validProducts = products.filter((p, i) => 
        Array.isArray(embeddings[i]?.embedding) && embeddings[i].embedding.length > 0
      );
      const validEmbeddings = embeddings.filter(e => 
        Array.isArray(e.embedding) && e.embedding.length > 0
      );

      if (validProducts.length === 0) {
        const fallbackRecs = getFallbackRecommendations(input, products);
        if (fallbackRecs.length > 0) {
          setMessages(msgs => [
            ...msgs,
            { from: 'bot', text: 'Here are some recommendations:' },
            ...fallbackRecs.map((p: any) => ({
              from: 'bot',
              product: p
            }))
          ]);
          setTyping(false);
          return;
        }
        
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: 'Sorry, no products with valid embeddings are available for recommendations.' }
        ]);
        setTyping(false);
        return;
      }

      // Compute similarity for each valid product
      const scored = validEmbeddings.map((e, i) => ({
        ...validProducts[i],
        similarity: cosineSimilarity(queryEmbedding, e.embedding)
      }));
      
      scored.sort((a, b) => b.similarity - a.similarity);
      const top = scored.slice(0, 4);
      
      if (top.length > 0 && top[0].similarity > 0.3) {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: 'Here are some recommendations:' },
          ...top.map((p: any) => ({
            from: 'bot',
            product: p
          }))
        ]);
        setTyping(false);
        return;
      }
    } catch (err) {
      console.error('Error in recommendation process:', err);
    }

    // Fallback to simple text matching if semantic search fails
    try {
      const fallbackRecs = getFallbackRecommendations(input, products);
      if (fallbackRecs.length > 0) {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: 'Here are some recommendations:' },
          ...fallbackRecs.map((p: any) => ({
            from: 'bot',
            product: p
          }))
        ]);
        setTyping(false);
        return;
      }
    } catch (fallbackErr) {
      console.error('Fallback recommendations failed:', fallbackErr);
    }

    // Final fallback response
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { from: 'bot', text: "I'm here to help with shopping, orders, and recommendations. Try asking for a product or help with returns!" }
      ]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all"
        onClick={() => setOpen(true)}
        style={{ display: open ? 'none' : 'block' }}
        aria-label="Open chatbot"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full bg-white rounded-2xl shadow-2xl border border-primary/20 flex flex-col animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl">
            <span className="text-white font-semibold">AI Assistant</span>
            <button 
              onClick={() => setOpen(false)} 
              className="text-white hover:text-gray-200"
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Messages */}
          <div 
            ref={chatRef} 
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white" 
            style={{ maxHeight: 320 }}
          >
            {messages.map((msg, i) => (
              msg.product ? (
                <div key={i} className="flex justify-start">
                  <div className="p-2 border rounded shadow bg-gray-50 max-w-xs">
                    {msg.product.ImageURL && (
                      <img 
                        src={msg.product.ImageURL} 
                        alt={msg.product.ProductName || 'Product image'} 
                        className="w-full h-24 object-cover rounded mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="font-bold">{msg.product.ProductName || 'Unnamed Product'}</div>
                    <div>${msg.product.Price?.toFixed(2) || '0.00'}</div>
                    {msg.product.ProductID && (
                      <a 
                        href={`/product/${msg.product.ProductID}`} 
                        className="text-blue-600 underline text-sm"
                      >
                        View Product
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div 
                  key={i} 
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`px-3 py-2 rounded-lg text-sm max-w-[80%] shadow ${
                      msg.from === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 max-w-[80%] shadow animate-pulse">
                  <span>AI Assistant is typing...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Form */}
          <form
            className="flex items-center gap-2 p-3 border-t border-primary/10 bg-white rounded-b-2xl"
            onSubmit={e => { 
              e.preventDefault(); 
              sendMessage(); 
            }}
          >
            <input
              className="flex-1 px-3 py-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              autoFocus
              aria-label="Chat input"
            />
            <button 
              type="submit" 
              className="p-2 text-primary hover:text-blue-700"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;