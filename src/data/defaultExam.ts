import { Question, QuestionOption } from '../types/exam';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Vocabulary',
    question: 'What does the word "Conceal" mean?',
    options: {
      A: 'To avoid discussing something that causes embarrassment.',
      B: 'To hide something deliberately so that others cannot discover or see it.',
      C: 'To protect something from being damaged or disturbed.',
      D: 'To keep something private by refusing to explain it.'
    },
    correctAnswer: 'B',
    explanation: 'Conceal means to keep from sight or to hide something deliberately.',
    marks: 1
  },
  {
    id: 2,
    category: 'Vocabulary',
    question: "A comprehensive report about a company's performance would most likely include:",
    options: {
      A: 'The most important findings without supporting details.',
      B: 'A detailed discussion of one particular department.',
      C: 'A complete examination of all important aspects of the company\'s performance.',
      D: 'A summary of the company\'s achievements and future plans only.'
    },
    correctAnswer: 'C',
    explanation: 'Comprehensive means complete and including everything that is necessary.',
    marks: 1
  },
  {
    id: 3,
    category: 'Attribute',
    question: 'Which sentence uses the word "Attribute" in the sense of a quality or characteristic?',
    options: {
      A: 'Patience is an important attribute of an effective teacher.',
      B: 'Patience is an important achievement of an effective teacher.',
      C: 'Patience is an important responsibility of an effective teacher.',
      D: 'Patience is an important opportunity for an effective teacher.'
    },
    correctAnswer: 'A',
    explanation: 'As a noun, attribute denotes a quality or feature regarded as a characteristic or inherent part of someone.',
    marks: 1
  },
  {
    id: 4,
    category: 'Artificial',
    question: 'Which situation best demonstrates something artificial?',
    options: {
      A: 'A flower growing naturally in a garden.',
      B: 'A river flowing through a mountain valley.',
      C: 'A wooden branch falling from a tree.',
      D: 'A decorative flower manufactured from plastic.'
    },
    correctAnswer: 'D',
    explanation: 'Artificial means made or produced by human beings rather than occurring naturally.',
    marks: 1
  },
  {
    id: 5,
    category: 'Crucial',
    question: 'A teacher discovers that a student has misunderstood an important concept before the final examination. Correcting that misunderstanding is crucial because:',
    options: {
      A: 'It might make the lesson slightly more interesting.',
      B: 'It is extremely important for the student\'s understanding and performance.',
      C: 'It could make the student finish the lesson earlier.',
      D: 'It is one of several optional activities in the classroom.'
    },
    correctAnswer: 'B',
    explanation: 'Crucial means of great importance; critical or decisive.',
    marks: 1
  },
  {
    id: 6,
    category: 'Convince',
    question: 'Sara wants her parents to allow her to attend an educational event. She presents strong reasons and successfully changes their minds. What did Sara do?',
    options: {
      A: 'She encouraged her parents to consider the event.',
      B: 'She informed her parents about the event.',
      C: 'She convinced her parents to allow her to attend.',
      D: 'She reminded her parents about the event.'
    },
    correctAnswer: 'C',
    explanation: 'Convince means to persuade someone of something or cause someone to agree through argument or evidence.',
    marks: 1
  },
  {
    id: 7,
    category: 'Brief',
    question: 'Which response would be considered a brief explanation?',
    options: {
      A: 'An explanation covering every background detail and possible outcome.',
      B: 'An explanation presenting the main idea in a few clear sentences.',
      C: 'An explanation discussing several related topics in depth.',
      D: 'An explanation repeating the same information in different words.'
    },
    correctAnswer: 'B',
    explanation: 'Brief means concise, short, and to the point.',
    marks: 1
  },
  {
    id: 8,
    category: 'Adequate',
    question: 'A student has 45 minutes to complete an assignment that normally requires 30 minutes. The available time is:',
    options: {
      A: 'Excessive for the task.',
      B: 'Barely insufficient for the task.',
      C: 'Adequate for the task.',
      D: 'Unnecessarily limited for the task.'
    },
    correctAnswer: 'C',
    explanation: 'Adequate means satisfactory or acceptable in quality or quantity.',
    marks: 1
  },
  {
    id: 9,
    category: 'Ambitious',
    question: 'Which person is best described as ambitious?',
    options: {
      A: 'Someone who enjoys imagining different possibilities but rarely pursues them.',
      B: 'Someone who sets challenging goals and works consistently to achieve them.',
      C: 'Someone who prefers familiar responsibilities and avoids additional challenges.',
      D: 'Someone who expects success without making significant efforts.'
    },
    correctAnswer: 'B',
    explanation: 'Ambitious means having or showing a strong desire and determination to succeed.',
    marks: 1
  },
  {
    id: 10,
    category: 'Adaptable',
    question: 'A student moves to a new city, joins an unfamiliar school and gradually becomes comfortable with its environment. Which quality does this demonstrate?',
    options: {
      A: 'The ability to maintain the same habits regardless of circumstances.',
      B: 'The ability to avoid unfamiliar situations until they become easier.',
      C: 'The ability to adjust to new conditions and changing circumstances.',
      D: 'The ability to remain independent without seeking assistance.'
    },
    correctAnswer: 'C',
    explanation: 'Adaptable means able to adjust readily to new or altered conditions.',
    marks: 1
  },
  {
    id: 11,
    category: 'Resilient',
    question: 'A student fails an examination, identifies their mistakes, prepares again and continues trying despite disappointment. Which adjective best describes this student?',
    options: {
      A: 'Optimistic.',
      B: 'Resilient.',
      C: 'Ambitious.',
      D: 'Disciplined.'
    },
    correctAnswer: 'B',
    explanation: 'Resilient means able to withstand or recover quickly from difficult conditions or setback.',
    marks: 1
  },
  {
    id: 12,
    category: 'Articulate',
    question: 'Which person would most accurately be described as articulate?',
    options: {
      A: 'Someone who has extensive knowledge but struggles to communicate ideas clearly.',
      B: 'Someone who speaks frequently but often changes the subject.',
      C: 'Someone who expresses thoughts and opinions clearly and effectively.',
      D: 'Someone who speaks confidently but rarely explains their reasoning.'
    },
    correctAnswer: 'C',
    explanation: 'Articulate means having or showing the ability to speak fluently and coherently.',
    marks: 1
  },
  {
    id: 13,
    category: 'Assertive',
    question: 'During a discussion, Ahmed disagrees with his classmates and explains his position confidently while respecting their opinions. Which quality does Ahmed demonstrate?',
    options: {
      A: 'Aggressiveness.',
      B: 'Assertiveness.',
      C: 'Stubbornness.',
      D: 'Indifference.'
    },
    correctAnswer: 'B',
    explanation: 'Assertive means having or showing a confident and forceful personality without being aggressive.',
    marks: 1
  },
  {
    id: 14,
    category: 'Empathetic',
    question: 'A friend is going through a difficult period. You listen carefully, try to understand their feelings and respond with genuine care. Which adjective best describes your behaviour?',
    options: {
      A: 'Sympathetic.',
      B: 'Supportive.',
      C: 'Empathetic.',
      D: 'Considerate.'
    },
    correctAnswer: 'C',
    explanation: 'Empathetic means showing an ability to understand and share the feelings of another.',
    marks: 1
  },
  {
    id: 15,
    category: 'Inquisitive',
    question: 'A student frequently asks thoughtful questions, explores unfamiliar subjects and wants to understand how things work. Which word best describes this student?',
    options: {
      A: 'Inquisitive.',
      B: 'Disciplined.',
      C: 'Humble.',
      D: 'Optimistic.'
    },
    correctAnswer: 'A',
    explanation: 'Inquisitive means curious or inquiring; eager to investigate and learn.',
    marks: 1
  },
  {
    id: 16,
    category: 'Overwhelmed',
    question: "A student receives several assignments, has limited time and feels unable to manage all the responsibilities at once. How would you describe the student's emotional state?",
    options: {
      A: 'Frustrated because one particular task is not going well.',
      B: 'Exhausted because physical energy has been completely used.',
      C: 'Overwhelmed because too many demands are difficult to manage simultaneously.',
      D: 'Reluctant because the student does not want to complete the assignments.'
    },
    correctAnswer: 'C',
    explanation: 'Overwhelmed means buried beneath a huge mass or having too much of something to deal with.',
    marks: 1
  },
  {
    id: 17,
    category: 'Intimidating',
    question: 'A student finds public speaking intimidating. What does this most likely mean?',
    options: {
      A: 'Speaking publicly makes the student feel slightly uncomfortable but interested.',
      B: 'Speaking publicly seems difficult or frightening and makes the student nervous.',
      C: 'Speaking publicly makes the student feel physically exhausted.',
      D: 'Speaking publicly makes the student unwilling to participate because of a lack of interest.'
    },
    correctAnswer: 'B',
    explanation: 'Intimidating means having a frightening, overawing, or daunting effect.',
    marks: 1
  },
  {
    id: 18,
    category: 'Reluctant',
    question: 'Ahmed has been invited to share his opinion in front of the class, but he hesitates because he feels uncomfortable. Ahmed is:',
    options: {
      A: 'Uncertain about what he wants to communicate.',
      B: 'Reluctant to share his opinion.',
      C: 'Unable to understand the discussion.',
      D: 'Intimidated by the opinions of others.'
    },
    correctAnswer: 'B',
    explanation: 'Reluctant means unwilling and hesitant; disinclined.',
    marks: 1
  },
  {
    id: 19,
    category: 'Weary',
    question: 'After travelling for several hours, Ali feels tired and has little energy left, although he can still continue his journey. Which word best describes his condition?',
    options: {
      A: 'Frustrated.',
      B: 'Exhausted.',
      C: 'Weary.',
      D: 'Overwhelmed.'
    },
    correctAnswer: 'C',
    explanation: 'Weary means feeling or showing extreme tiredness, especially as a result of excessive exertion.',
    marks: 1
  },
  {
    id: 20,
    category: 'Furious',
    question: 'A person discovers that someone has deliberately damaged something extremely valuable to them. They become extremely angry. Which word best describes their reaction?',
    options: {
      A: 'Frustrated.',
      B: 'Disappointed.',
      C: 'Furious.',
      D: 'Upset.'
    },
    correctAnswer: 'C',
    explanation: 'Furious means extremely angry; full of fury.',
    marks: 1
  },
  {
    id: 21,
    category: 'Heartbroken',
    question: 'A person loses someone they deeply love and experiences profound emotional sadness. Which expression best describes this feeling?',
    options: {
      A: 'Deeply disappointed.',
      B: 'Emotionally frustrated.',
      C: 'Completely heartbroken.',
      D: 'Extremely overwhelmed.'
    },
    correctAnswer: 'C',
    explanation: 'Heartbroken means suffering from overwhelming distress, sorrow, or grief.',
    marks: 1
  },
  {
    id: 22,
    category: 'Idiom',
    question: 'A student is afraid of admitting a serious mistake but finally gathers courage, accepts responsibility and apologizes. Which idiom best describes this decision?',
    options: {
      A: 'Easier said than done.',
      B: 'Bite the bullet.',
      C: 'In the long run.',
      D: 'It slipped my mind.'
    },
    correctAnswer: 'B',
    explanation: 'To bite the bullet means to face a difficult situation with courage and resolve.',
    marks: 1
  },
  {
    id: 23,
    category: 'Idiom',
    question: 'A student spends an hour every day improving their English. The improvement may seem small initially, but the effort is expected to produce significant benefits over time. Which expression best completes the idea?',
    options: {
      A: 'In the long run.',
      B: 'At the last minute.',
      C: 'For the time being.',
      D: 'Once in a while.'
    },
    correctAnswer: 'A',
    explanation: 'In the long run refers to a time over an extended period or in the ultimate outcome.',
    marks: 1
  },
  {
    id: 24,
    category: 'Idiom',
    question: 'You promised to bring your notebook to class but accidentally forgot it. Which response is most appropriate?',
    options: {
      A: 'I was reluctant to bring my notebook.',
      B: 'I was overwhelmed by my notebook.',
      C: 'It completely slipped my mind.',
      D: 'I decided to bite the bullet.'
    },
    correctAnswer: 'C',
    explanation: 'It slipped my mind is an idiom meaning you forgot about it completely.',
    marks: 1
  },
  {
    id: 25,
    category: 'Idiom',
    question: 'Someone says, "Just stop worrying about every problem and stay positive." You reply that following this advice is difficult in real life, even though it sounds simple. Which expression best communicates your response?',
    options: {
      A: 'Better late than never.',
      B: 'Easier said than done.',
      C: 'In the long run.',
      D: 'Where there is a will, there is a way.'
    },
    correctAnswer: 'B',
    explanation: 'Easier said than done means an action that is easily talked about is harder to accomplish in practice.',
    marks: 1
  },
  {
    id: 26,
    category: 'Idiom',
    question: 'Three students are whispering, hiding their phones and suddenly stopping their conversation whenever their teacher approaches. The teacher suspects they:',
    options: {
      A: 'Have something unusual or possibly mischievous planned.',
      B: 'Have forgotten something important about their lesson.',
      C: 'Are reluctant to participate in the classroom discussion.',
      D: 'Are trying to convince someone to change their opinion.'
    },
    correctAnswer: 'A',
    explanation: 'To be up to something means doing or planning something secretly or mischievous.',
    marks: 1
  },
  {
    id: 27,
    category: 'Proverb',
    question: 'A person repeatedly promises to help their elderly neighbour but never does anything. Another person rarely makes promises but consistently provides assistance. Which proverb best describes the second person\'s behaviour?',
    options: {
      A: 'Practice Makes Perfect.',
      B: 'Honesty Is the Best Policy.',
      C: 'Actions Speak Louder Than Words.',
      D: 'Better Late Than Never.'
    },
    correctAnswer: 'C',
    explanation: 'Actions speak louder than words means what you actually do has a stronger impact than what you say.',
    marks: 1
  },
  {
    id: 28,
    category: 'Proverb',
    question: 'A student comes from a financially disadvantaged family but remains determined, finds available educational opportunities and works hard to become a successful doctor. Which proverb best describes this situation?',
    options: {
      A: 'Don\'t Judge a Book by Its Cover.',
      B: 'Where There Is a Will, There Is a Way.',
      C: 'Practice Makes Perfect.',
      D: 'Better Late Than Never.'
    },
    correctAnswer: 'B',
    explanation: 'Where there is a will, there is a way means if you are determined enough, you will find a way to achieve your goal.',
    marks: 1
  },
  {
    id: 29,
    category: 'Phrasal Verbs',
    question: 'Choose the correct sequence to complete the sentence: "Every morning, I ______ at 6 o\'clock, ______ out of bed, ______ the bedroom light and ______ my school uniform."',
    options: {
      A: 'Get up, wake up, turn off, take off.',
      B: 'Wake up, get up, turn on, put on.',
      C: 'Wake up, stand up, turn off, pick up.',
      D: 'Get up, sit down, turn on, put on.'
    },
    correctAnswer: 'B',
    explanation: 'Wake up (cease sleeping), get up (rise from bed), turn on (activate lights), put on (dress in uniform).',
    marks: 1
  },
  {
    id: 30,
    category: 'Proverb',
    question: 'A person sees a quiet student and immediately assumes that the student is unintelligent. After working with them, they discover that the student is exceptionally knowledgeable and talented. Which proverb best describes the lesson?',
    options: {
      A: 'Actions Speak Louder Than Words.',
      B: 'Honesty Is the Best Policy.',
      C: 'Don\'t Judge a Book by Its Cover.',
      D: 'Better Late Than Never.'
    },
    correctAnswer: 'C',
    explanation: 'Don\'t judge a book by its cover means one should not judge the worth or character of something or someone merely by appearance.',
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
