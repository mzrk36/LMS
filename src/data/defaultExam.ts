import { Question, QuestionOption } from '../types/exam';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Vocabulary',
    question: 'What does the word "Conceal" mean?',
    options: {
      A: 'To show something to everyone.',
      B: 'To hide something so others cannot see it.',
      C: 'To clean and repair something.',
      D: 'To talk about something openly.'
    },
    correctAnswer: 'B',
    explanation: 'Conceal means to hide something deliberately from sight.',
    marks: 1
  },
  {
    id: 2,
    category: 'Vocabulary',
    question: 'What does the word "Comprehensive" mean?',
    options: {
      A: 'Very short and quick.',
      B: 'Difficult to read or hear.',
      C: 'Complete and covering all important details.',
      D: 'Boring and uninteresting.'
    },
    correctAnswer: 'C',
    explanation: 'Comprehensive means thorough, complete, and including everything necessary.',
    marks: 1
  },
  {
    id: 3,
    category: 'Vocabulary',
    question: 'Which sentence uses the word "Attribute" as a good quality or trait?',
    options: {
      A: 'Patience is an important attribute of a good teacher.',
      B: 'He attribute his homework yesterday morning.',
      C: 'She bought an attribute from the grocery market.',
      D: 'The football match was an attribute today.'
    },
    correctAnswer: 'A',
    explanation: 'As a noun, attribute means a good feature, quality, or characteristic of a person.',
    marks: 1
  },
  {
    id: 4,
    category: 'Vocabulary',
    question: 'Which of the following is "Artificial" (made by humans, not natural)?',
    options: {
      A: 'Fresh rain falling from the sky.',
      B: 'A green apple growing on a tree.',
      C: 'A plastic flower made in a factory.',
      D: 'Fresh river water flowing from a mountain.'
    },
    correctAnswer: 'C',
    explanation: 'Artificial means made or produced by humans rather than occurring naturally.',
    marks: 1
  },
  {
    id: 5,
    category: 'Vocabulary',
    question: 'Drinking clean water every day is "Crucial" for good health. Here, crucial means:',
    options: {
      A: 'Optional and not needed.',
      B: 'Extremely important and necessary.',
      C: 'Dangerous and harmful.',
      D: 'Fun and entertaining.'
    },
    correctAnswer: 'B',
    explanation: 'Crucial means extremely important and necessary for success or health.',
    marks: 1
  },
  {
    id: 6,
    category: 'Vocabulary',
    question: 'Ali gave good reasons and changed his friend’s mind. Ali managed to ______ his friend.',
    options: {
      A: 'Ignore',
      B: 'Frighten',
      C: 'Convince',
      D: 'Forget'
    },
    correctAnswer: 'C',
    explanation: 'Convince means to persuade someone to believe or agree with something.',
    marks: 1
  },
  {
    id: 7,
    category: 'Vocabulary',
    question: 'The teacher gave a "Brief" explanation of the lesson. What does brief mean?',
    options: {
      A: 'Very long and detailed.',
      B: 'Short, clear, and quick.',
      C: 'Loud and angry.',
      D: 'Confusing and messy.'
    },
    correctAnswer: 'B',
    explanation: 'Brief means short and to the point.',
    marks: 1
  },
  {
    id: 8,
    category: 'Vocabulary',
    question: 'There is "Adequate" food for all guests at the party. What does adequate mean?',
    options: {
      A: 'Not enough to eat.',
      B: 'Completely spoiled and bad.',
      C: 'Enough and satisfactory for everyone.',
      D: 'Too expensive to buy.'
    },
    correctAnswer: 'C',
    explanation: 'Adequate means enough in quantity or quality for what is needed.',
    marks: 1
  },
  {
    id: 9,
    category: 'Personality',
    question: 'A person who sets big goals and works hard to achieve success is described as:',
    options: {
      A: 'Lazy',
      B: 'Ambitious',
      C: 'Careless',
      D: 'Shy'
    },
    correctAnswer: 'B',
    explanation: 'Ambitious means having a strong desire and determination to succeed.',
    marks: 1
  },
  {
    id: 10,
    category: 'Personality',
    question: 'When Sarah moved to a new school, she quickly made friends and got used to the new rules. Sarah is:',
    options: {
      A: 'Stubborn',
      B: 'Selfish',
      C: 'Adaptable',
      D: 'Afraid'
    },
    correctAnswer: 'C',
    explanation: 'Adaptable means able to adjust easily to new situations and changes.',
    marks: 1
  },
  {
    id: 11,
    category: 'Personality',
    question: 'Hamza failed his driving test once, but he did not give up. He practiced and passed on his next try. Hamza is:',
    options: {
      A: 'Greedy',
      B: 'Resilient',
      C: 'Weak',
      D: 'Disobedient'
    },
    correctAnswer: 'B',
    explanation: 'Resilient means able to recover quickly from difficulties or setbacks.',
    marks: 1
  },
  {
    id: 12,
    category: 'Communication',
    question: 'Someone who speaks clearly, uses good words, and explains ideas easily is:',
    options: {
      A: 'Silent',
      B: 'Confused',
      C: 'Articulate',
      D: 'Rude'
    },
    correctAnswer: 'C',
    explanation: 'Articulate means able to express thoughts and ideas clearly and effectively.',
    marks: 1
  },
  {
    id: 13,
    category: 'Communication',
    question: 'During class, Ahmed speaks up for his opinion politely and confidently without shouting. Ahmed is:',
    options: {
      A: 'Aggressive',
      B: 'Assertive',
      C: 'Fearful',
      D: 'Careless'
    },
    correctAnswer: 'B',
    explanation: 'Assertive means confident and firm in expressing yourself while still being polite and respectful.',
    marks: 1
  },
  {
    id: 14,
    category: 'Personality',
    question: 'When your friend is feeling sad, you listen carefully and truly understand how they feel. You are being:',
    options: {
      A: 'Cruel',
      B: 'Impatient',
      C: 'Empathetic',
      D: 'Distracted'
    },
    correctAnswer: 'C',
    explanation: 'Empathetic means understanding and sharing the feelings of another person.',
    marks: 1
  },
  {
    id: 15,
    category: 'Personality',
    question: 'A student who is always curious, asks great questions, and loves discovering new facts is:',
    options: {
      A: 'Inquisitive',
      B: 'Bored',
      C: 'Sleepy',
      D: 'Selfish'
    },
    correctAnswer: 'A',
    explanation: 'Inquisitive means curious and eager to learn or investigate new things.',
    marks: 1
  },
  {
    id: 16,
    category: 'Emotions',
    question: 'You have four exams tomorrow, lots of chores, and too little time to finish everything. You feel:',
    options: {
      A: 'Calm and relaxed.',
      B: 'Cheerful and energetic.',
      C: 'Overwhelmed with too much to handle.',
      D: 'Excited with nothing to do.'
    },
    correctAnswer: 'C',
    explanation: 'Overwhelmed means feeling stressed because you have too much work or pressure to deal with at once.',
    marks: 1
  },
  {
    id: 17,
    category: 'Emotions',
    question: 'Giving a speech in front of 500 people feels "Intimidating". This means it feels:',
    options: {
      A: 'Simple and comforting.',
      B: 'Scary, nervous, or difficult.',
      C: 'Boring and dull.',
      D: 'Funny and silly.'
    },
    correctAnswer: 'B',
    explanation: 'Intimidating means frightening, daunting, or making someone feel nervous and lacking confidence.',
    marks: 1
  },
  {
    id: 18,
    category: 'Emotions',
    question: 'Bilal was asked to sing on stage, but he hesitated because he was shy. Bilal was ______ to sing.',
    options: {
      A: 'Eager',
      B: 'Reluctant',
      C: 'Proud',
      D: 'Hurried'
    },
    correctAnswer: 'B',
    explanation: 'Reluctant means unwilling, hesitant, or slow to do something.',
    marks: 1
  },
  {
    id: 19,
    category: 'Emotions',
    question: 'After walking 12 kilometers in the hot sun, the traveler felt very tired and lacked energy. The traveler was:',
    options: {
      A: 'Cheerfully active.',
      B: 'Completely angry.',
      C: 'Weary and tired.',
      D: 'Eager to run.'
    },
    correctAnswer: 'C',
    explanation: 'Weary means feeling tired, worn out, or drained of energy after hard work or effort.',
    marks: 1
  },
  {
    id: 20,
    category: 'Emotions',
    question: 'Someone stole Tariq\'s bicycle from his front yard. When Tariq realized it, he became "Furious". Furious means:',
    options: {
      A: 'Pleasantly surprised.',
      B: 'Mildly interested.',
      C: 'Extremely angry.',
      D: 'A little sleepy.'
    },
    correctAnswer: 'C',
    explanation: 'Furious means full of fury or extremely angry.',
    marks: 1
  },
  {
    id: 21,
    category: 'Emotions',
    question: 'When their beloved old dog passed away, the family was "Heartbroken". This means they were:',
    options: {
      A: 'Filled with deep sadness and grief.',
      B: 'Slightly confused.',
      C: 'Very energetic.',
      D: 'Annoyed by the noise.'
    },
    correctAnswer: 'A',
    explanation: 'Heartbroken means suffering from overwhelming sorrow, grief, or deep sadness.',
    marks: 1
  },
  {
    id: 22,
    category: 'Idioms',
    question: 'Going to the dentist was scary, but Omar decided to "Bite the bullet" and get his tooth fixed. This idiom means:',
    options: {
      A: 'To eat something very hard.',
      B: 'To face a tough situation bravely.',
      C: 'To run away and hide.',
      D: 'To argue with the doctor.'
    },
    correctAnswer: 'B',
    explanation: 'To bite the bullet means to face an unavoidable, difficult situation with courage.',
    marks: 1
  },
  {
    id: 23,
    category: 'Idioms',
    question: 'Reading 15 minutes of English every day will help your vocabulary "In the long run". This idiom means:',
    options: {
      A: 'Over a long period of time in the future.',
      B: 'While running a fast race.',
      C: 'Only for today.',
      D: 'Never in your life.'
    },
    correctAnswer: 'A',
    explanation: 'In the long run means over a longer period of time or in the ultimate future.',
    marks: 1
  },
  {
    id: 24,
    category: 'Idioms',
    question: 'I promised to bring my friend’s book today, but "It slipped my mind". This means:',
    options: {
      A: 'I dropped the book on the floor.',
      B: 'I did not want to return it.',
      C: 'I completely forgot about it.',
      D: 'I gave the book to another student.'
    },
    correctAnswer: 'C',
    explanation: 'It slipped my mind is an everyday idiom meaning you forgot about it.',
    marks: 1
  },
  {
    id: 25,
    category: 'Idioms',
    question: 'Someone said: "Just wake up at 5:00 AM every single morning!" You say that is "Easier said than done". This means:',
    options: {
      A: 'It sounds simple to say, but is hard to actually do.',
      B: 'It is very easy to do, but difficult to say.',
      C: 'Nobody knows how to speak about it.',
      D: 'It is easy to do in one second.'
    },
    correctAnswer: 'A',
    explanation: 'Easier said than done means something is easy to suggest or talk about, but difficult to practice.',
    marks: 1
  },
  {
    id: 26,
    category: 'Idioms',
    question: 'The two students are whispering quietly and hiding something behind their backs. The teacher thinks they are "Up to something". This means:',
    options: {
      A: 'They are secretly planning something playful or mischievous.',
      B: 'They are doing their homework quietly.',
      C: 'They are climbing up the school stairs.',
      D: 'They are fast asleep at their desks.'
    },
    correctAnswer: 'A',
    explanation: 'To be up to something means doing or planning something in secret or being mischievous.',
    marks: 1
  },
  {
    id: 27,
    category: 'Proverbs',
    question: 'Raza always promises to help his friends but never does. Zain rarely talks, but always helps when needed. Which proverb describes Zain?',
    options: {
      A: 'Better late than never.',
      B: 'Actions speak louder than words.',
      C: 'Practice makes perfect.',
      D: 'Time is money.'
    },
    correctAnswer: 'B',
    explanation: 'Actions speak louder than words means what you actually do is much more meaningful than what you say.',
    marks: 1
  },
  {
    id: 28,
    category: 'Proverbs',
    question: 'Mariam came from a poor background, but with strong determination and hard work, she became a doctor. Which proverb fits her story?',
    options: {
      A: 'Where there is a will, there is a way.',
      B: 'Don\'t cry over spilled milk.',
      C: 'Better late than never.',
      D: 'All that glitters is not gold.'
    },
    correctAnswer: 'A',
    explanation: 'Where there is a will, there is a way means if you are determined enough, you will find a way to succeed.',
    marks: 1
  },
  {
    id: 29,
    category: 'Phrasal Verbs',
    question: 'Choose the correct sequence: "Every morning, I ______ at 7:00 AM, ______ of bed, ______ the bathroom light, and ______ my school uniform."',
    options: {
      A: 'wake up, get out, turn on, put on',
      B: 'get up, sleep, turn off, take off',
      C: 'wake up, stand, turn off, throw',
      D: 'sit down, get out, switch, pick'
    },
    correctAnswer: 'A',
    explanation: 'Wake up (stop sleeping), get out (leave bed), turn on (switch on light), put on (wear clothes).',
    marks: 1
  },
  {
    id: 30,
    category: 'Proverbs',
    question: 'The old book had a plain and dusty cover, but the story inside was fantastic. Which proverb teaches us this lesson?',
    options: {
      A: 'Honesty is the best policy.',
      B: 'Practice makes perfect.',
      C: 'Don\'t judge a book by its cover.',
      D: 'Better safe than sorry.'
    },
    correctAnswer: 'C',
    explanation: 'Don\'t judge a book by its cover means you should not judge the true value of someone or something by appearance alone.',
    marks: 1
  }
];

export const ANSWER_KEY: Record<number, QuestionOption> = DEFAULT_QUESTIONS.reduce((acc, q) => {
  if (q.correctAnswer) acc[q.id] = q.correctAnswer;
  return acc;
}, {} as Record<number, QuestionOption>);

export const DEFAULT_EXAM_METADATA = {
  id: 'genzomate-eng-001',
  title: 'English Vocabulary & Expressions Test',
  totalQuestions: 30,
  totalMarks: 30,
  durationMinutes: 30
};
