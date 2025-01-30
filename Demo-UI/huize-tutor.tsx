import React, { useState, useRef } from 'react';
import { Send, Menu, Move, Pencil, Circle, Square, Trash2, Plus, MessageSquare } from 'lucide-react';

const HuizeTutor = () => {
  const [language, setLanguage] = useState('zh');
  const [showDrawingArea, setShowDrawingArea] = useState(true);
  const [currentTool, setCurrentTool] = useState('pencil');
  const [penColor, setPenColor] = useState('#000000');
  const [inputText, setInputText] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  // 初始化消息列表
  const [messages, setMessages] = useState([
    {
      role: 'user',
      content: {
        en: "Can you teach me question 3?",
        zh: "教我第三题吧",
        ru: "Можете научить меня решать задачу 3?"
      }
    },
    {
      role: 'assistant',
      content: {
        en: "Let's look at question 3:\nFor sequence xn = {1/n}, prove that sup xn = 1 and inf xn = 0.\nLet's think step by step:\n1. First, can you tell me what the first few terms of sequence {1/n} look like? Let's write them out to observe.\n2. Then, to prove sup xn = 1, we need to prove two points:\n   * 1 is an upper bound\n   * 1 is the least upper bound\nWould you like to try writing out the first few terms of this sequence? This way we can understand the problem more intuitively.",
        zh: "让我们看第3题:\n对于数列 xn = {1/n}, 证明 sup xn = 1 且 inf xn = 0。\n让我们一步步思考:\n1. 首先,你能告诉我这个数列 {1/n} 的前几项是什么样的吗？我们可以先写出来观察一下。\n2. 然后,为了证明 sup xn = 1,我们需要证明两点:\n   * 1 是上界\n   * 1 是最小上界\n你想先尝试写出这个数列的前几项吗?这样我们可以更直观地理解这个问题。",
        ru: "Давайте рассмотрим задачу 3:\nДля последовательности xn = {1/n}, докажите, что sup xn = 1 и inf xn = 0.\nДавайте подумаем пошагово..."
      }
    },
    {
      role: 'user',
      content: {
        en: "Here's my attempt",
        zh: "对不对",
        ru: "Вот моя попытка"
      },
      hasDrawing: "/api/placeholder/800/300"
    },
    {
      role: 'assistant',
      content: {
        en: "Let's analyze your start:\nFor sequence xn = {1/n}, to prove sup xn = 1 and inf xn = 0\nYou wrote:\n1. xn = {1, 1/2, 1/3, 1/4, 1/5,...} ✓ Correct, this is the sequence form\n2. ∀ a∈Xn, a≤1 ✓ Correct, this shows 1 is an upper bound\n3. Let b≥a, ∀ 1≤b This part needs adjustment. To prove 1 is the least upper bound, we should say: for any M < 1, there exists some xn such that xn > M\nYour thinking is basically correct, but to completely prove sup xn = 1:\n1. First prove 1 is an upper bound (you've done this)\n2. Then prove 1 is the least upper bound (this part needs completion)\nWould you like to try proving 1 is the least upper bound? Hint: you can use the Archimedean property.",
        zh: "让我们分析一下你的开始:\n对于数列 xn = {1/n}, 要证明 sup xn = 1 且 inf xn = 0\n你写了:\n1. xn = {1, 1/2, 1/3, 1/4, 1/5,...} ✓ 正确，这是数列的形式\n2. ∀ a∈Xn, a≤1 ✓ 正确，这说明1是上界\n3. Let b≥a, ∀ 1≤b 这部分需要调整。要证明1是最小上界，我们应该说： 对任意 M < 1，存在某个 xn 使得 xn > M\n你的思路基本对的，但是为了完整证明 sup xn = 1：\n1. 先证明1是上界 (你已经做了)\n2. 再证明1是最小上界 (这部分需要完善)\n你想试试如何证明1是最小上界吗？提示：可以使用阿基米德性质。",
        ru: "Давайте проанализируем ваше начало..."
      }
    }
  ]);

  // 画布相关函数
  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      role: 'user',
      content: {
        en: inputText,
        zh: inputText,
        ru: inputText
      }
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="w-6 h-6" />
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img
                  src="/api/placeholder/40/40"
                  alt="Huize-Tutor Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h1 className="text-xl font-bold">Huize-Tutor</h1>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-blue-500 text-white border border-blue-400 rounded-lg px-4 py-2"
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="ru">Русский</option>
          </select>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-4">
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-xl ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white shadow'
              }`}>
                <p className="whitespace-pre-wrap font-math">{msg.content[language]}</p>
              </div>
            </div>
            {msg.hasDrawing && (
              <div className="mt-2 flex justify-center">
                <img
                  src={msg.hasDrawing}
                  alt="Mathematical proof"
                  className="max-w-[80%] rounded-lg border shadow-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Drawing Area */}
      {showDrawingArea && (
        <div className="p-4 bg-white border-t">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = canvasRef.current;
                      if (!canvas) return;
                      const ctx = canvas.getContext('2d');
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                      // 计算图片的缩放比例以适应画布
                      const scale = Math.min(
                        canvas.width / img.width,
                        canvas.height / img.height
                      );
                      const x = (canvas.width - img.width * scale) / 2;
                      const y = (canvas.height - img.height * scale) / 2;
                      ctx.drawImage(
                        img,
                        x,
                        y,
                        img.width * scale,
                        img.height * scale
                      );
                    };
                    img.src = URL.createObjectURL(file);
                  }
                }}
                className="hidden"
                id="imageInput"
              />
              <label
                htmlFor="imageInput"
                className="cursor-pointer p-2 rounded-lg hover:bg-blue-100"
              >
                <Plus className="w-6 h-6" />
              </label>
              {[
                { id: 'pencil', icon: Pencil, label: '铅笔' },
                { id: 'circle', icon: Circle, label: '圆形' },
                { id: 'square', icon: Square, label: '方形' }
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setCurrentTool(tool.id)}
                  className={`p-2 rounded-lg ${
                    currentTool === tool.id ? 'bg-blue-100 text-blue-600' : ''
                  }`}
                >
                  <tool.icon className="w-6 h-6" />
                </button>
              ))}
            </div>
            <button onClick={clearCanvas} className="text-red-500 p-2">
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full border rounded-lg bg-white touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-4">
          <button
            onClick={() => setShowDrawingArea(!showDrawingArea)}
            className="p-3 border rounded-xl hover:bg-gray-50"
          >
            <Pencil className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-3 border rounded-xl focus:outline-none focus:border-blue-500"
            placeholder={
              language === 'zh' ? '输入你的问题...' :
              language === 'ru' ? 'Введите ваш вопрос...' :
              'Type your question...'
            }
          />
          <button
            onClick={handleSubmit}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HuizeTutor;