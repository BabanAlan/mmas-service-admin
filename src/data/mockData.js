// Функция для генерации случайных имен
const generateRandomName = () => {
  const firstNames = [
    'Александр', 'Алексей', 'Андрей', 'Антон', 'Артем', 'Борис', 'Вадим', 'Валентин', 'Валерий', 'Виктор',
    'Владимир', 'Вячеслав', 'Геннадий', 'Георгий', 'Дмитрий', 'Евгений', 'Игорь', 'Иван', 'Кирилл', 'Константин',
    'Максим', 'Михаил', 'Николай', 'Олег', 'Павел', 'Петр', 'Роман', 'Сергей', 'Станислав', 'Федор',
    'Анна', 'Валентина', 'Вера', 'Галина', 'Дарья', 'Екатерина', 'Елена', 'Жанна', 'Ирина', 'Кристина',
    'Лариса', 'Мария', 'Наталья', 'Ольга', 'Полина', 'Светлана', 'Татьяна', 'Юлия', 'Яна', 'Алина'
  ];
  
  const lastNames = [
    'Иванов', 'Петров', 'Сидоров', 'Козлов', 'Морозов', 'Волков', 'Новиков', 'Соколов', 'Попов', 'Лебедев',
    'Козлов', 'Новиков', 'Морозов', 'Петров', 'Волков', 'Соловьев', 'Васильев', 'Зайцев', 'Павлов', 'Семенов',
    'Голубев', 'Виноградов', 'Богданов', 'Воробьев', 'Федоров', 'Михайлов', 'Белов', 'Тарасов', 'Беляев', 'Комаров',
    'Орлов', 'Киселев', 'Макаров', 'Андреев', 'Ковалев', 'Ильин', 'Гусев', 'Титов', 'Кузьмин', 'Кудрявцев'
  ];
  
  const middleNames = [
    'Александрович', 'Алексеевич', 'Андреевич', 'Антонович', 'Артемович', 'Борисович', 'Вадимович', 'Валентинович',
    'Валериевич', 'Викторович', 'Владимирович', 'Вячеславович', 'Геннадиевич', 'Георгиевич', 'Дмитриевич', 'Евгеньевич',
    'Игоревич', 'Иванович', 'Кириллович', 'Константинович', 'Максимович', 'Михайлович', 'Николаевич', 'Олегович',
    'Павлович', 'Петрович', 'Романович', 'Сергеевич', 'Станиславович', 'Федорович', 'Александровна', 'Алексеевна',
    'Андреевна', 'Антоновна', 'Артемовна', 'Борисовна', 'Вадимовна', 'Валентиновна', 'Валериевна', 'Викторовна',
    'Владимировна', 'Вячеславовна', 'Геннадиевна', 'Георгиевна', 'Дмитриевна', 'Евгеньевна', 'Игоревна', 'Ивановна',
    'Кирилловна', 'Константиновна', 'Максимовна', 'Михайловна', 'Николаевна', 'Олеговна', 'Павловна', 'Петровна',
    'Романовна', 'Сергеевна', 'Станиславовна', 'Федоровна'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
  
  return `${lastName} ${firstName} ${middleName}`;
};

// Функция для генерации случайной даты рождения (от 18 до 50 лет)
const generateRandomBirthDate = () => {
  const now = new Date();
  const minAge = 18;
  const maxAge = 50;
  const birthYear = now.getFullYear() - Math.floor(Math.random() * (maxAge - minAge + 1)) - minAge;
  const birthMonth = Math.floor(Math.random() * 12) + 1;
  const birthDay = Math.floor(Math.random() * 28) + 1; // Используем 28 для простоты
  
  return `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
};

// Маппинг студий к сокращениям
const studioAbbreviations = {
  "Теплый Стан": "ТС",
  "Ясенево": "Яс", 
  "Раменки": "Ра",
  "Академический": "Ак",
  "Покровские Холмы": "ПХ",
  "Бутово": "Бу",
  "Красная Пресня": "КП"
};

// Счетчики учеников по студиям
const studioStudentCounters = {
  "Теплый Стан": 0,
  "Ясенево": 0, 
  "Раменки": 0,
  "Академический": 0,
  "Покровские Холмы": 0,
  "Бутово": 0,
  "Красная Пресня": 0
};

// Функция для генерации MMAS-ID на основе студии
const generateMmasId = (studio) => {
  const abbreviation = studioAbbreviations[studio];
  if (!abbreviation) {
    throw new Error(`Неизвестная студия: ${studio}`);
  }
  
  // Увеличиваем счетчик для данной студии
  studioStudentCounters[studio]++;
  const studentNumber = studioStudentCounters[studio];
  
  // Форматируем номер с ведущими нулями (0001-9999)
  const formattedNumber = studentNumber.toString().padStart(4, '0');
  
  return `${abbreviation}-${formattedNumber}`;
};

// Глобальный счетчик для уникальных ID
let globalStudentId = 1;

// Генерируем учеников для каждой студии
const generateStudentsForStudio = (studio, count) => {
  const students = [];
  const beltDistribution = [
    { belt: 'Белый', weight: 25 },
    { belt: 'Желтый', weight: 20 },
    { belt: 'Оранжевый', weight: 15 },
    { belt: 'Зеленый', weight: 12 },
    { belt: 'Сиреневый', weight: 10 },
    { belt: 'Синий', weight: 8 },
    { belt: 'Красный', weight: 5 },
    { belt: 'II Коричневый', weight: 3 },
    { belt: 'I Коричневый', weight: 2 },
    { belt: 'Черный I', weight: 0.5 },
    { belt: 'Черный II', weight: 0.3 },
    { belt: 'Черный III', weight: 0.2 },
    { belt: 'Черный IV', weight: 0.1 },
    { belt: 'Черный V', weight: 0.1 },
    { belt: 'Черный VI', weight: 0.1 },
    { belt: 'Черный VII', weight: 0.1 },
    { belt: 'Черный VIII', weight: 0.1 },
    { belt: 'Черный IX', weight: 0.1 },
    { belt: 'Черный X', weight: 0.1 }
  ];
  
  const getRandomBelt = () => {
    const random = Math.random() * 100;
    let cumulative = 0;
    for (const item of beltDistribution) {
      cumulative += item.weight;
      if (random <= cumulative) {
        return item.belt;
      }
    }
    return 'Белый';
  };
  
  for (let i = 0; i < count; i++) {
    students.push({
      id: globalStudentId++,
      fullName: generateRandomName(),
      belt: getRandomBelt(),
      birthDate: generateRandomBirthDate(),
      mmasId: generateMmasId(studio),
      studio: studio
    });
  }
  
  return students;
};

// Генерируем всех учеников
const allStudents = [];
const studios = [
  "Теплый Стан",
  "Ясенево", 
  "Раменки",
  "Бутово",
  "Академический",
  "Покровские Холмы",
  "Красная Пресня"
];

studios.forEach(studio => {
  const studentCount = Math.floor(Math.random() * 31) + 20; // 20-50 учеников
  const studioStudents = generateStudentsForStudio(studio, studentCount);
  allStudents.push(...studioStudents);
});

// Тестовые данные для студии боевых искусств
export const mockStudents = allStudents;

export const mockStudios = [
  "Теплый Стан",
  "Ясенево",
  "Раменки",
  "Бутово",
  "Академический",
  "Покровские Холмы",
  "Красная Пресня"
];

export const mockBelts = [
  "Белый",
  "Желтый", 
  "Оранжевый",
  "Зеленый",
  "Сиреневый",
  "Синий",
  "Красный",
  "II Коричневый",
  "I Коричневый",
  "Черный I",
  "Черный II",
  "Черный III",
  "Черный IV",
  "Черный V",
  "Черный VI",
  "Черный VII",
  "Черный VIII",
  "Черный IX",
  "Черный X"
];

// Экспортируем функции и объекты для использования в других компонентах
export { studioAbbreviations, generateMmasId };

export const mockAttendance = [
  {
    id: 1,
    studentId: 1,
    date: "2024-01-15",
    studio: "Теплый Стан",
    duration: 60, // в минутах
    present: true
  },
  {
    id: 2,
    studentId: 2,
    date: "2024-01-15",
    studio: "Ясенево",
    duration: 120,
    present: true
  },
  {
    id: 3,
    studentId: 3,
    date: "2024-01-15",
    studio: "Теплый Стан",
    duration: 90,
    present: true
  },
  {
    id: 4,
    studentId: 4,
    date: "2024-01-15",
    studio: "Раменки",
    duration: 0,
    present: false
  }
];

// Функции для работы с данными (в будущем заменятся на API вызовы)
export const getStudents = () => {
  return Promise.resolve(mockStudents);
};

export const addStudent = (student) => {
  // Если mmasId не указан, генерируем его автоматически
  let mmasId = student.mmasId;
  if (!mmasId && student.studio) {
    mmasId = generateMmasId(student.studio);
  }
  
  const newStudent = {
    ...student,
    id: Math.max(...mockStudents.map(s => s.id)) + 1,
    mmasId: mmasId
  };
  mockStudents.push(newStudent);
  return Promise.resolve(newStudent);
};

export const updateStudent = (id, updates) => {
  const index = mockStudents.findIndex(s => s.id === id);
  if (index !== -1) {
    mockStudents[index] = { ...mockStudents[index], ...updates };
    return Promise.resolve(mockStudents[index]);
  }
  return Promise.reject(new Error('Студент не найден'));
};

export const deleteStudent = (id) => {
  const index = mockStudents.findIndex(s => s.id === id);
  if (index !== -1) {
    mockStudents.splice(index, 1);
    return Promise.resolve();
  }
  return Promise.reject(new Error('Студент не найден'));
};

export const getAttendance = (date, studio) => {
  return Promise.resolve(
    mockAttendance.filter(a => a.date === date && a.studio === studio)
  );
};

export const updateAttendance = (attendanceData) => {
  // Обновляем или добавляем запись о посещаемости
  const existingIndex = mockAttendance.findIndex(
    a => a.studentId === attendanceData.studentId && 
         a.date === attendanceData.date && 
         a.studio === attendanceData.studio
  );
  
  if (existingIndex !== -1) {
    mockAttendance[existingIndex] = { ...mockAttendance[existingIndex], ...attendanceData };
  } else {
    mockAttendance.push({
      ...attendanceData,
      id: Math.max(...mockAttendance.map(a => a.id), 0) + 1
    });
  }
  
  return Promise.resolve();
};

// ---------------------- Payments ----------------------
export const mockPayments = [];

// Seed some payments based on attendance for demo
mockAttendance.forEach((a) => {
  if (a.present && a.duration > 0) {
    mockPayments.push({
      id: mockPayments.length + 1,
      studentId: a.studentId,
      date: a.date,
      studio: a.studio,
      amount: Math.round((a.duration / 60) * 500), // условно 500 руб/час
      method: 'Наличные',
      status: 'Оплачено'
    });
  }
});

// Add additional synthetic payments for testing UI
for (let i = 0; i < Math.min(mockStudents.length, 20); i++) {
  const s = mockStudents[i];
  const day = (i % 28) + 1;
  mockPayments.push({
    id: mockPayments.length + 1,
    studentId: s.id,
    date: `2024-02-${day.toString().padStart(2, '0')}`,
    studio: s.studio,
    amount: 500 + (i % 4) * 250,
    method: ['Наличные', 'Карта', 'Перевод'][i % 3],
    status: i % 5 === 0 ? 'Не оплачено' : 'Оплачено'
  });
}

export const getPaymentsByStudent = (studentId) => {
  return Promise.resolve(
    mockPayments.filter(p => p.studentId === studentId)
  );
};

export const getPaymentsByDate = (date) => {
  return Promise.resolve(
    mockPayments.filter(p => p.date === date)
  );
};