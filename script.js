/**
 * StudyMate — Student Study Planner Web App
 * Pure Vanilla JavaScript: Architecture, State Management & Event Handling
 */

(function () {
  'use strict';

  // --- Constants & Keys ---
  const STORAGE_KEY = 'studymate_data_v1';

  // Motivational Quotes Collection
  const MOTIVATIONAL_QUOTES = [
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "Focus on progress, not perfection.", author: "Bill Phillips" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "Education is the passport to the future, for tomorrow belongs to those who prepare today.", author: "Malcolm X" }
  ];

  // Helper: Format date string to YYYY-MM-DD
  function toISODate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  // Generate today and near-future dates for realistic starter data
  const today = new Date();
  const datePlusDays = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return toISODate(d);
  };

  // Default Seed Data
  const DEFAULT_DATA = {
    studentName: 'Alex Morgan',
    dailyTargetMinutes: 120,
    streak: 3,
    lastActiveDate: toISODate(today),
    tasks: [
      {
        id: 'task-1',
        title: 'Calculus III Problem Set 4',
        subject: 'Calculus III',
        dueDate: datePlusDays(2),
        priority: 'high',
        description: 'Complete problems 14 to 32 from chapter on vector fields and line integrals.',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-2',
        title: 'Data Structures Lab 3 - Binary Trees',
        subject: 'Data Structures',
        dueDate: datePlusDays(4),
        priority: 'high',
        description: 'Implement AVL tree rebalancing algorithms and pass all unit tests on GitHub.',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-3',
        title: 'Macroeconomics Essay Outline',
        subject: 'Economics 201',
        dueDate: datePlusDays(1),
        priority: 'medium',
        description: 'Create a 2-page outline evaluating fiscal policy responses during recessions.',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-4',
        title: 'Physics Lab Report: Optics & Refraction',
        subject: 'Modern Physics',
        dueDate: datePlusDays(-1), // overdue for demo
        priority: 'medium',
        description: 'Submit calculated refractive indices and error propagation formulas.',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-5',
        title: 'Read Academic Ethics Chapter 1-3',
        subject: 'Academic Writing',
        dueDate: datePlusDays(-2),
        priority: 'low',
        description: 'Review APA 7th edition referencing rules for the upcoming bibliography.',
        completed: true,
        completedAt: toISODate(today),
        createdAt: new Date().toISOString()
      }
    ],
    exams: [
      {
        id: 'exam-1',
        name: 'Calculus III Midterm Exam',
        subject: 'Calculus III',
        date: datePlusDays(3),
        notes: 'Room 304. Covers Partial derivatives, multiple integrals, and Green’s Theorem.'
      },
      {
        id: 'exam-2',
        name: 'Data Structures Mid-Semester Quiz',
        subject: 'Data Structures',
        date: datePlusDays(8),
        notes: 'Covers Big-O notation, linked lists, stacks, queues, and tree traversals.'
      },
      {
        id: 'exam-3',
        name: 'Modern Physics Test 1',
        subject: 'Modern Physics',
        date: datePlusDays(15),
        notes: 'Lecture Hall A. Special relativity and photoelectric effect.'
      }
    ],
    timetable: [
      { id: 'tt-1', subject: 'Calculus III', day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Hall 3 - Rm 204' },
      { id: 'tt-2', subject: 'Data Structures Lecture', day: 'Monday', startTime: '11:00', endTime: '12:30', room: 'CS Building 101' },
      { id: 'tt-3', subject: 'Economics 201', day: 'Tuesday', startTime: '10:00', endTime: '11:30', room: 'Social Sci 202' },
      { id: 'tt-4', subject: 'Modern Physics', day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Science Lab 4' },
      { id: 'tt-5', subject: 'Data Structures Lab', day: 'Wednesday', startTime: '13:00', endTime: '15:00', room: 'Mac Lab 2' },
      { id: 'tt-6', subject: 'Academic Writing Seminar', day: 'Thursday', startTime: '14:00', endTime: '15:30', room: 'Library Annex' },
      { id: 'tt-7', subject: 'Physics Practical', day: 'Friday', startTime: '10:00', endTime: '12:00', room: 'Science Lab 4' },
      { id: 'tt-8', subject: 'Group Study Workshop', day: 'Saturday', startTime: '11:00', endTime: '13:00', room: 'Student Union Lounge' }
    ],
    studyLogs: [
      { id: 'log-1', subject: 'Calculus Practice', minutes: 45, date: toISODate(today) },
      { id: 'log-2', subject: 'Data Structures Coding', minutes: 35, date: toISODate(today) }
    ]
  };

  // --- App State ---
  let appState = null;

  // Load state from local storage or initialize with default
  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        appState = JSON.parse(stored);
      } else {
        appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
        saveState();
      }
    } catch (e) {
      console.error('Error loading local storage:', e);
      appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    updateStreak();
  }

  // Save current state to local storage
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Error writing to local storage:', e);
      showToast('Error saving data. Storage might be full.', 'danger');
    }
  }

  // Manage daily study streak logic
  function updateStreak() {
    const todayStr = toISODate(new Date());
    if (appState.lastActiveDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = toISODate(yesterday);

      if (appState.lastActiveDate === yesterdayStr) {
        // Consecutive day
        // Will increment once user logs a study session or completes a task today
      } else {
        // Streak broken if gap is > 1 day
        const daysDiff = Math.floor((new Date(todayStr) - new Date(appState.lastActiveDate)) / (1000 * 60 * 60 * 24));
        if (daysDiff > 1) {
          appState.streak = 1;
        }
      }
      appState.lastActiveDate = todayStr;
      saveState();
    }
  }

  // --- UI Elements Cache ---
  const elements = {
    // Nav & Layout
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    closeSidebarBtn: document.getElementById('closeSidebarBtn'),
    navLinks: document.querySelectorAll('.sidebar-nav .nav-link'),
    contentSections: document.querySelectorAll('.content-section'),
    studentNameDisplay: document.getElementById('studentNameDisplay'),
    avatarDisplay: document.getElementById('avatarDisplay'),
    pageGreeting: document.getElementById('pageGreeting'),
    currentDateStr: document.getElementById('currentDateStr'),
    navTaskBadge: document.getElementById('navTaskBadge'),
    navExamBadge: document.getElementById('navExamBadge'),

    // Dashboard
    motivationalQuote: document.getElementById('motivationalQuote'),
    quoteAuthor: document.getElementById('quoteAuthor'),
    refreshQuoteBtn: document.getElementById('refreshQuoteBtn'),
    dashTotalTasks: document.getElementById('dashTotalTasks'),
    dashPendingTasks: document.getElementById('dashPendingTasks'),
    dashOverdueWarning: document.getElementById('dashOverdueWarning'),
    dashCompletedTasks: document.getElementById('dashCompletedTasks'),
    dashCompletionRate: document.getElementById('dashCompletionRate'),
    dashGoalProgressText: document.getElementById('dashGoalProgressText'),
    dashGoalProgressBar: document.getElementById('dashGoalProgressBar'),
    dashTodayScheduleList: document.getElementById('dashTodayScheduleList'),
    dashUrgentTasksList: document.getElementById('dashUrgentTasksList'),
    dashExamsList: document.getElementById('dashExamsList'),
    todayDayName: document.getElementById('todayDayName'),

    // Tasks Section
    openAddTaskModalBtn: document.getElementById('openAddTaskModalBtn'),
    quickAddTaskHeader: document.getElementById('quickAddTaskHeader'),
    quickAddTaskMobile: document.getElementById('quickAddTaskMobile'),
    taskListContainer: document.getElementById('taskListContainer'),
    displayedTaskCount: document.getElementById('displayedTaskCount'),
    taskSearchInput: document.getElementById('taskSearchInput'),
    taskStatusFilter: document.getElementById('taskStatusFilter'),
    taskPriorityFilter: document.getElementById('taskPriorityFilter'),
    taskSubjectFilter: document.getElementById('taskSubjectFilter'),
    taskSortFilter: document.getElementById('taskSortFilter'),

    // Exams Section
    openAddExamModalBtn: document.getElementById('openAddExamModalBtn'),
    examsGrid: document.getElementById('examsGrid'),

    // Timetable Section
    openAddClassModalBtn: document.getElementById('openAddClassModalBtn'),
    timetableDaysNav: document.querySelector('.timetable-days-nav'),
    dayTabs: document.querySelectorAll('.day-tab'),
    currentDayViewTitle: document.getElementById('currentDayViewTitle'),
    currentDayClassCount: document.getElementById('currentDayClassCount'),
    timetableList: document.getElementById('timetableList'),

    // Study Goals Section
    openLogSessionModalBtn: document.getElementById('openLogSessionModalBtn'),
    changeGoalBtn: document.getElementById('changeGoalBtn'),
    goalTargetDisplay: document.getElementById('goalTargetDisplay'),
    goalTodayStudied: document.getElementById('goalTodayStudied'),
    goalStatusBadge: document.getElementById('goalStatusBadge'),
    goalStreakDisplay: document.getElementById('goalStreakDisplay'),
    goalTasksCompletedToday: document.getElementById('goalTasksCompletedToday'),
    goalProgressSubtext: document.getElementById('goalProgressSubtext'),
    goalRemainingText: document.getElementById('goalRemainingText'),
    goalBigProgressBar: document.getElementById('goalBigProgressBar'),
    studyLogsList: document.getElementById('studyLogsList'),

    // Focus Timer
    modeStudyBtn: document.getElementById('modeStudyBtn'),
    modeShortBreakBtn: document.getElementById('modeShortBreakBtn'),
    modeLongBreakBtn: document.getElementById('modeLongBreakBtn'),
    timerSubjectInput: document.getElementById('timerSubjectInput'),
    timerProgressCircle: document.getElementById('timerProgressCircle'),
    timerTimeDisplay: document.getElementById('timerTimeDisplay'),
    timerModeLabel: document.getElementById('timerModeLabel'),
    timerStartBtn: document.getElementById('timerStartBtn'),
    timerPauseBtn: document.getElementById('timerPauseBtn'),
    timerResetBtn: document.getElementById('timerResetBtn'),
    autoLogTimerSession: document.getElementById('autoLogTimerSession'),

    // Modals
    taskModal: document.getElementById('taskModal'),
    taskForm: document.getElementById('taskForm'),
    taskModalTitle: document.getElementById('taskModalTitle'),
    taskId: document.getElementById('taskId'),
    taskTitle: document.getElementById('taskTitle'),
    taskSubject: document.getElementById('taskSubject'),
    taskPriority: document.getElementById('taskPriority'),
    taskDueDate: document.getElementById('taskDueDate'),
    taskDescription: document.getElementById('taskDescription'),
    taskTitleError: document.getElementById('taskTitleError'),
    taskSubjectError: document.getElementById('taskSubjectError'),
    taskDueDateError: document.getElementById('taskDueDateError'),

    examModal: document.getElementById('examModal'),
    examForm: document.getElementById('examForm'),
    examModalTitle: document.getElementById('examModalTitle'),
    examId: document.getElementById('examId'),
    examName: document.getElementById('examName'),
    examSubject: document.getElementById('examSubject'),
    examDate: document.getElementById('examDate'),
    examNotes: document.getElementById('examNotes'),
    examNameError: document.getElementById('examNameError'),
    examSubjectError: document.getElementById('examSubjectError'),
    examDateError: document.getElementById('examDateError'),

    classModal: document.getElementById('classModal'),
    classForm: document.getElementById('classForm'),
    classModalTitle: document.getElementById('classModalTitle'),
    classId: document.getElementById('classId'),
    classSubject: document.getElementById('classSubject'),
    classDay: document.getElementById('classDay'),
    classRoom: document.getElementById('classRoom'),
    classStartTime: document.getElementById('classStartTime'),
    classEndTime: document.getElementById('classEndTime'),
    classSubjectError: document.getElementById('classSubjectError'),
    classStartTimeError: document.getElementById('classStartTimeError'),
    classEndTimeError: document.getElementById('classEndTimeError'),
    classOverlapAlert: document.getElementById('classOverlapAlert'),
    classOverlapMessage: document.getElementById('classOverlapMessage'),

    profileModal: document.getElementById('profileModal'),
    profileForm: document.getElementById('profileForm'),
    profileStudentNameInput: document.getElementById('profileStudentNameInput'),
    editProfileBtn: document.getElementById('editProfileBtn'),

    goalModal: document.getElementById('goalModal'),
    goalForm: document.getElementById('goalForm'),
    dailyTargetMinutes: document.getElementById('dailyTargetMinutes'),

    logSessionModal: document.getElementById('logSessionModal'),
    logSessionForm: document.getElementById('logSessionForm'),
    logSessionSubject: document.getElementById('logSessionSubject'),
    logSessionMinutes: document.getElementById('logSessionMinutes'),
    logSessionDate: document.getElementById('logSessionDate'),
    logSessionSubjectError: document.getElementById('logSessionSubjectError'),
    logSessionMinutesError: document.getElementById('logSessionMinutesError'),

    confirmModal: document.getElementById('confirmModal'),
    confirmModalMessage: document.getElementById('confirmModalMessage'),
    confirmActionBtn: document.getElementById('confirmActionBtn'),

    toastContainer: document.getElementById('toastContainer')
  };

  // --- Modal Utility Functions ---
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Setup generic close triggers on backdrop or close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-close');
      closeModal(document.getElementById(targetId));
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // --- Toast Notifications ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'danger') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.25s ease forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, 3200);
  }

  // --- Confirmation Modal Manager ---
  let pendingConfirmAction = null;
  function showConfirmDialog(message, onConfirm) {
    elements.confirmModalMessage.textContent = message;
    pendingConfirmAction = onConfirm;
    openModal(elements.confirmModal);
  }

  elements.confirmActionBtn.addEventListener('click', () => {
    if (typeof pendingConfirmAction === 'function') {
      pendingConfirmAction();
    }
    closeModal(elements.confirmModal);
    pendingConfirmAction = null;
  });

  // --- Helper: String escaping for XSS protection ---
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Date Math Helpers ---
  function getDaysRemaining(targetDateStr) {
    const todayZero = new Date();
    todayZero.setHours(0, 0, 0, 0);

    const targetDate = new Date(targetDateStr + 'T00:00:00');
    const diffTime = targetDate - todayZero;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }

  function getDayOfWeekName(date = new Date()) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  // --- NAVIGATION MANAGER ---
  function switchSection(sectionId) {
    // Update active section
    elements.contentSections.forEach(section => {
      section.classList.toggle('active', section.id === `section-${sectionId}`);
    });

    // Update active nav link
    elements.navLinks.forEach(link => {
      const target = link.getAttribute('data-section');
      link.classList.toggle('active', target === sectionId);
    });

    // Close mobile drawer if open
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('show');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Setup sidebar nav clicks
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      window.location.hash = sectionId;
      switchSection(sectionId);
    });
  });

  // Handle other links with data-section (e.g. view more on dashboard)
  document.addEventListener('click', (e) => {
    const sectionTrigger = e.target.closest('[data-section]');
    if (sectionTrigger && !sectionTrigger.classList.contains('nav-link')) {
      e.preventDefault();
      const sectionId = sectionTrigger.getAttribute('data-section');
      window.location.hash = sectionId;
      switchSection(sectionId);
    }
  });

  // Mobile menu buttons
  elements.mobileMenuBtn.addEventListener('click', () => {
    elements.sidebar.classList.add('open');
    elements.sidebarOverlay.classList.add('show');
  });

  elements.closeSidebarBtn.addEventListener('click', () => {
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('show');
  });

  elements.sidebarOverlay.addEventListener('click', () => {
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('show');
  });

  // --- Profile Name Customization ---
  function renderProfile() {
    elements.studentNameDisplay.textContent = appState.studentName || 'Student';
    const initials = (appState.studentName || 'AM')
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    elements.avatarDisplay.textContent = initials || 'ST';

    // Top greeting
    const hour = new Date().getHours();
    let timeGreeting = 'Good day';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 18) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    elements.pageGreeting.textContent = `${timeGreeting}, ${appState.studentName || 'Alex'}!`;
  }

  elements.editProfileBtn.addEventListener('click', () => {
    elements.profileStudentNameInput.value = appState.studentName || '';
    openModal(elements.profileModal);
  });

  elements.profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = elements.profileStudentNameInput.value.trim();
    if (newName) {
      appState.studentName = newName;
      saveState();
      renderProfile();
      closeModal(elements.profileModal);
      showToast('Profile updated!', 'success');
    }
  });

  // --- Motivational Quote Manager ---
  function randomizeQuote() {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    const quote = MOTIVATIONAL_QUOTES[randomIndex];
    elements.motivationalQuote.textContent = `"${quote.text}"`;
    elements.quoteAuthor.textContent = `— ${quote.author}`;
  }

  elements.refreshQuoteBtn.addEventListener('click', () => {
    randomizeQuote();
  });

  // --- DASHBOARD RENDERING ---
  function renderDashboard() {
    const todayStr = toISODate(new Date());
    const tasks = appState.tasks || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;

    // Overdue tasks
    const overdueCount = tasks.filter(t => !t.completed && t.dueDate < todayStr).length;

    // Daily Study Goal Progress
    const studiedTodayMinutes = (appState.studyLogs || [])
      .filter(log => log.date === todayStr)
      .reduce((sum, log) => sum + (Number(log.minutes) || 0), 0);

    const targetMinutes = Number(appState.dailyTargetMinutes) || 120;
    const goalPercent = Math.min(100, Math.round((studiedTodayMinutes / targetMinutes) * 100));

    // Update Stat Cards
    elements.dashTotalTasks.textContent = totalTasks;
    elements.dashPendingTasks.textContent = pendingTasks;
    elements.navTaskBadge.textContent = pendingTasks;

    if (overdueCount > 0) {
      elements.dashOverdueWarning.textContent = `${overdueCount} overdue assignment${overdueCount > 1 ? 's' : ''}`;
      elements.dashOverdueWarning.className = 'stat-detail text-danger';
    } else {
      elements.dashOverdueWarning.textContent = 'All up to date!';
      elements.dashOverdueWarning.className = 'stat-detail text-success';
    }

    elements.dashCompletedTasks.textContent = completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    elements.dashCompletionRate.textContent = `${completionRate}% completion rate`;

    elements.dashGoalProgressText.textContent = `${studiedTodayMinutes} / ${targetMinutes}m`;
    elements.dashGoalProgressBar.style.width = `${goalPercent}%`;

    // Today's Date Text
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.currentDateStr.textContent = now.toLocaleDateString('en-US', options);

    // Render Today's Schedule on Dashboard
    renderDashboardSchedule();

    // Render Urgent Tasks on Dashboard
    renderDashboardUrgentTasks();

    // Render Upcoming Exams on Dashboard
    renderDashboardExams();
  }

  function renderDashboardSchedule() {
    const currentDay = getDayOfWeekName();
    elements.todayDayName.textContent = `${currentDay}'s Lectures & Classes`;

    const dayClasses = (appState.timetable || [])
      .filter(item => item.day.toLowerCase() === currentDay.toLowerCase())
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (dayClasses.length === 0) {
      elements.dashTodayScheduleList.innerHTML = `
        <div class="empty-state" style="padding: 24px 10px;">
          <div class="empty-icon" style="font-size: 1.8rem;">🎉</div>
          <div class="empty-title">No Classes Scheduled Today</div>
          <p class="empty-desc">Enjoy your day off or catch up on independent study.</p>
        </div>
      `;
      return;
    }

    elements.dashTodayScheduleList.innerHTML = dayClasses.map(cls => `
      <div class="timeline-item">
        <div class="timeline-time">${escapeHtml(cls.startTime)} - ${escapeHtml(cls.endTime)}</div>
        <div class="timeline-content">
          <h4>${escapeHtml(cls.subject)}</h4>
          <p>${escapeHtml(cls.room || 'Classroom TBA')}</p>
        </div>
      </div>
    `).join('');
  }

  function renderDashboardUrgentTasks() {
    const pendingTasks = (appState.tasks || [])
      .filter(t => !t.completed)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 4);

    if (pendingTasks.length === 0) {
      elements.dashUrgentTasksList.innerHTML = `
        <div class="empty-state" style="padding: 20px 10px;">
          <div class="empty-icon" style="font-size: 1.8rem;">🌟</div>
          <div class="empty-title">Zero Pending Assignments</div>
          <p class="empty-desc">You are completely caught up with your university tasks.</p>
        </div>
      `;
      return;
    }

    const todayStr = toISODate(new Date());

    elements.dashUrgentTasksList.innerHTML = pendingTasks.map(task => {
      const isOverdue = task.dueDate < todayStr;
      const daysLeft = getDaysRemaining(task.dueDate);
      let dueText = `Due in ${daysLeft} days`;
      if (daysLeft === 0) dueText = 'Due Today!';
      else if (daysLeft === 1) dueText = 'Due Tomorrow';
      else if (daysLeft < 0) dueText = `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) > 1 ? 's' : ''}`;

      return `
        <div class="task-mini-item">
          <input type="checkbox" class="task-checkbox" data-task-id="${task.id}">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-main);">${escapeHtml(task.title)}</div>
            <div style="font-size: 0.78rem; display: flex; gap: 8px; align-items: center; margin-top: 2px;">
              <span class="task-subject-tag">${escapeHtml(task.subject)}</span>
              <span class="${isOverdue ? 'text-danger' : 'text-muted'}" style="font-weight: 600;">${dueText}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach checkbox events
    elements.dashUrgentTasksList.querySelectorAll('.task-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const taskId = cb.getAttribute('data-task-id');
        toggleTaskCompletion(taskId);
      });
    });
  }

  function renderDashboardExams() {
    const exams = (appState.exams || [])
      .map(exam => ({
        ...exam,
        daysLeft: getDaysRemaining(exam.date)
      }))
      .filter(e => e.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);

    elements.navExamBadge.textContent = exams.length;

    if (exams.length === 0) {
      elements.dashExamsList.innerHTML = `
        <div class="empty-state" style="padding: 24px 10px;">
          <div class="empty-icon" style="font-size: 1.8rem;">🎯</div>
          <div class="empty-title">No Upcoming Exams</div>
          <p class="empty-desc">Add upcoming midterms or finals in the Exam Planner.</p>
        </div>
      `;
      return;
    }

    elements.dashExamsList.innerHTML = exams.map(exam => {
      let badgeClass = 'badge-normal';
      let countdownText = `${exam.daysLeft} days left`;

      if (exam.daysLeft === 0) {
        badgeClass = 'badge-urgent';
        countdownText = 'TODAY!';
      } else if (exam.daysLeft === 1) {
        badgeClass = 'badge-urgent';
        countdownText = 'Tomorrow!';
      } else if (exam.daysLeft <= 4) {
        badgeClass = 'badge-urgent';
      } else if (exam.daysLeft <= 7) {
        badgeClass = 'badge-warning';
      }

      return `
        <div class="exam-countdown-item">
          <div class="exam-info">
            <h4>${escapeHtml(exam.name)}</h4>
            <span>${escapeHtml(exam.subject)} &bull; ${escapeHtml(exam.date)}</span>
          </div>
          <span class="countdown-badge ${badgeClass}">${countdownText}</span>
        </div>
      `;
    }).join('');
  }

  // --- TASK MANAGER (ASSIGNMENTS) ---
  function populateSubjectFilter() {
    const tasks = appState.tasks || [];
    const subjects = [...new Set(tasks.map(t => t.subject).filter(Boolean))].sort();

    const currentVal = elements.taskSubjectFilter.value;
    elements.taskSubjectFilter.innerHTML = '<option value="all">All Subjects</option>' +
      subjects.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');

    if (subjects.includes(currentVal)) {
      elements.taskSubjectFilter.value = currentVal;
    }
  }

  function renderTasks() {
    populateSubjectFilter();

    let tasks = [...(appState.tasks || [])];
    const todayStr = toISODate(new Date());

    // Search filter
    const query = elements.taskSearchInput.value.trim().toLowerCase();
    if (query) {
      tasks = tasks.filter(t =>
        (t.title && t.title.toLowerCase().includes(query)) ||
        (t.subject && t.subject.toLowerCase().includes(query)) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Status filter
    const statusFilter = elements.taskStatusFilter.value;
    if (statusFilter === 'pending') {
      tasks = tasks.filter(t => !t.completed);
    } else if (statusFilter === 'completed') {
      tasks = tasks.filter(t => t.completed);
    } else if (statusFilter === 'overdue') {
      tasks = tasks.filter(t => !t.completed && t.dueDate < todayStr);
    }

    // Priority filter
    const priorityFilter = elements.taskPriorityFilter.value;
    if (priorityFilter !== 'all') {
      tasks = tasks.filter(t => t.priority === priorityFilter);
    }

    // Subject filter
    const subjectFilter = elements.taskSubjectFilter.value;
    if (subjectFilter !== 'all') {
      tasks = tasks.filter(t => t.subject === subjectFilter);
    }

    // Sort filter
    const sortVal = elements.taskSortFilter.value;
    const priorityWeight = { high: 3, medium: 2, low: 1 };

    tasks.sort((a, b) => {
      if (sortVal === 'dueDateAsc') return a.dueDate.localeCompare(b.dueDate);
      if (sortVal === 'dueDateDesc') return b.dueDate.localeCompare(a.dueDate);
      if (sortVal === 'priorityDesc') return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      if (sortVal === 'titleAsc') return a.title.localeCompare(b.title);
      return 0;
    });

    elements.displayedTaskCount.textContent = tasks.length;

    if (tasks.length === 0) {
      elements.taskListContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <div class="empty-title">No assignments found</div>
          <p class="empty-desc">Try clearing filters or add a new assignment to keep your study plan organized.</p>
          <button class="btn btn-primary" id="emptyStateAddTaskBtn">Add New Assignment</button>
        </div>
      `;
      const btn = document.getElementById('emptyStateAddTaskBtn');
      if (btn) btn.addEventListener('click', openCreateTaskModal);
      return;
    }

    elements.taskListContainer.innerHTML = tasks.map(task => {
      const isOverdue = !task.completed && task.dueDate < todayStr;
      const daysLeft = getDaysRemaining(task.dueDate);

      let dueBadgeHtml = '';
      if (task.completed) {
        dueBadgeHtml = `<span class="badge-priority low" style="color: var(--color-success); background: var(--color-success-bg);">Completed</span>`;
      } else if (isOverdue) {
        dueBadgeHtml = `<span class="badge-overdue">Overdue by ${Math.abs(daysLeft)}d</span>`;
      } else if (daysLeft === 0) {
        dueBadgeHtml = `<span class="badge-overdue" style="background:#fee2e2; color:#b91c1c;">Due Today!</span>`;
      } else if (daysLeft === 1) {
        dueBadgeHtml = `<span class="badge-priority medium">Due Tomorrow</span>`;
      } else {
        dueBadgeHtml = `<span class="text-muted">Due in ${daysLeft} days</span>`;
      }

      return `
        <div class="task-card-item ${task.completed ? 'completed' : ''}" id="task-item-${task.id}">
          <div class="task-checkbox-wrapper">
            <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
          </div>

          <div class="task-main-details">
            <div class="task-header-row">
              <span class="task-title">${escapeHtml(task.title)}</span>
              <span class="task-subject-tag">${escapeHtml(task.subject)}</span>
              <span class="badge-priority ${task.priority}">${escapeHtml(task.priority)}</span>
            </div>

            ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}

            <div class="task-meta-row">
              <div class="task-due-info">
                <span>📅 ${escapeHtml(task.dueDate)}</span>
                ${dueBadgeHtml}
              </div>
            </div>
          </div>

          <div class="task-actions">
            <button class="action-btn-sm edit-task-btn" data-task-id="${task.id}" title="Edit Task" aria-label="Edit Task">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="action-btn-sm delete delete-task-btn" data-task-id="${task.id}" title="Delete Task" aria-label="Delete Task">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach Task Event Listeners
    elements.taskListContainer.querySelectorAll('.task-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const taskId = cb.getAttribute('data-task-id');
        toggleTaskCompletion(taskId);
      });
    });

    elements.taskListContainer.querySelectorAll('.edit-task-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-task-id');
        openEditTaskModal(taskId);
      });
    });

    elements.taskListContainer.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-task-id');
        promptDeleteTask(taskId);
      });
    });
  }

  function toggleTaskCompletion(taskId) {
    const task = (appState.tasks || []).find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    if (task.completed) {
      task.completedAt = toISODate(new Date());
      showToast(`Completed: "${task.title}" 🎉`, 'success');
    } else {
      delete task.completedAt;
      showToast(`Marked pending: "${task.title}"`, 'info');
    }

    saveState();
    renderTasks();
    renderDashboard();
    renderGoals();
  }

  function openCreateTaskModal() {
    elements.taskForm.reset();
    elements.taskId.value = '';
    elements.taskModalTitle.textContent = 'New Assignment';
    elements.taskTitleError.textContent = '';
    elements.taskSubjectError.textContent = '';
    elements.taskDueDateError.textContent = '';
    elements.taskDueDate.value = datePlusDays(3);
    elements.taskPriority.value = 'medium';
    openModal(elements.taskModal);
  }

  function openEditTaskModal(taskId) {
    const task = (appState.tasks || []).find(t => t.id === taskId);
    if (!task) return;

    elements.taskId.value = task.id;
    elements.taskTitle.value = task.title;
    elements.taskSubject.value = task.subject;
    elements.taskPriority.value = task.priority;
    elements.taskDueDate.value = task.dueDate;
    elements.taskDescription.value = task.description || '';
    elements.taskModalTitle.textContent = 'Edit Assignment';

    elements.taskTitleError.textContent = '';
    elements.taskSubjectError.textContent = '';
    elements.taskDueDateError.textContent = '';

    openModal(elements.taskModal);
  }

  function promptDeleteTask(taskId) {
    const task = (appState.tasks || []).find(t => t.id === taskId);
    if (!task) return;

    showConfirmDialog(`Are you sure you want to delete assignment "${task.title}"?`, () => {
      appState.tasks = appState.tasks.filter(t => t.id !== taskId);
      saveState();
      renderTasks();
      renderDashboard();
      renderGoals();
      showToast('Assignment deleted', 'info');
    });
  }

  // Task form submission with validation
  elements.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validation
    let isValid = true;
    const titleVal = elements.taskTitle.value.trim();
    const subjectVal = elements.taskSubject.value.trim();
    const dueDateVal = elements.taskDueDate.value;

    elements.taskTitleError.textContent = '';
    elements.taskSubjectError.textContent = '';
    elements.taskDueDateError.textContent = '';

    if (!titleVal) {
      elements.taskTitleError.textContent = 'Please enter an assignment title.';
      isValid = false;
    }
    if (!subjectVal) {
      elements.taskSubjectError.textContent = 'Please specify the course or subject.';
      isValid = false;
    }
    if (!dueDateVal) {
      elements.taskDueDateError.textContent = 'Please choose a due date.';
      isValid = false;
    }

    if (!isValid) return;

    const editId = elements.taskId.value;
    if (editId) {
      // Update
      const task = appState.tasks.find(t => t.id === editId);
      if (task) {
        task.title = titleVal;
        task.subject = subjectVal;
        task.priority = elements.taskPriority.value;
        task.dueDate = dueDateVal;
        task.description = elements.taskDescription.value.trim();
        showToast('Assignment updated successfully!', 'success');
      }
    } else {
      // Create
      const newTask = {
        id: 'task-' + Date.now(),
        title: titleVal,
        subject: subjectVal,
        priority: elements.taskPriority.value,
        dueDate: dueDateVal,
        description: elements.taskDescription.value.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      appState.tasks.unshift(newTask);
      showToast('New assignment added to planner!', 'success');
    }

    saveState();
    closeModal(elements.taskModal);
    renderTasks();
    renderDashboard();
  });

  // Task Filter Inputs listeners
  elements.taskSearchInput.addEventListener('input', renderTasks);
  elements.taskStatusFilter.addEventListener('change', renderTasks);
  elements.taskPriorityFilter.addEventListener('change', renderTasks);
  elements.taskSubjectFilter.addEventListener('change', renderTasks);
  elements.taskSortFilter.addEventListener('change', renderTasks);

  elements.openAddTaskModalBtn.addEventListener('click', openCreateTaskModal);
  elements.quickAddTaskHeader.addEventListener('click', openCreateTaskModal);
  elements.quickAddTaskMobile.addEventListener('click', openCreateTaskModal);

  // --- EXAM PLANNER ---
  function renderExams() {
    const exams = [...(appState.exams || [])];
    
    // Sort by exam date ascending
    exams.sort((a, b) => a.date.localeCompare(b.date));

    if (exams.length === 0) {
      elements.examsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">📅</div>
          <div class="empty-title">No exams scheduled</div>
          <p class="empty-desc">Track all your midterms, finals, tests, and quizzes with countdown reminders.</p>
          <button class="btn btn-primary" id="emptyStateAddExamBtn">Add Your First Exam</button>
        </div>
      `;
      const btn = document.getElementById('emptyStateAddExamBtn');
      if (btn) btn.addEventListener('click', openCreateExamModal);
      return;
    }

    elements.examsGrid.innerHTML = exams.map(exam => {
      const daysLeft = getDaysRemaining(exam.date);
      let cardClass = '';
      let countdownHtml = '';

      if (daysLeft < 0) {
        countdownHtml = `<span class="countdown-number" style="color: var(--text-muted);">Passed</span>`;
      } else if (daysLeft === 0) {
        cardClass = 'critical';
        countdownHtml = `
          <div>
            <div class="countdown-number text-danger">TODAY!</div>
            <div class="countdown-label">Good luck on your exam!</div>
          </div>
        `;
      } else if (daysLeft === 1) {
        cardClass = 'critical';
        countdownHtml = `
          <div>
            <div class="countdown-number text-danger">Tomorrow!</div>
            <div class="countdown-label">Final revision session</div>
          </div>
        `;
      } else if (daysLeft <= 7) {
        cardClass = 'approaching';
        countdownHtml = `
          <div>
            <div class="countdown-number" style="color: #d97706;">${daysLeft} Days</div>
            <div class="countdown-label">Approaching soon</div>
          </div>
        `;
      } else {
        countdownHtml = `
          <div>
            <div class="countdown-number">${daysLeft} Days</div>
            <div class="countdown-label">Remaining to prepare</div>
          </div>
        `;
      }

      return `
        <div class="exam-card ${cardClass}" id="exam-card-${exam.id}">
          <div>
            <div class="exam-card-header">
              <span class="exam-subject-badge">${escapeHtml(exam.subject)}</span>
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">📅 ${escapeHtml(exam.date)}</span>
            </div>
            <h3 class="exam-card-title">${escapeHtml(exam.name)}</h3>

            <div class="exam-countdown-box">
              ${countdownHtml}
              <div style="font-size: 1.6rem;">⏱️</div>
            </div>

            <p class="exam-notes">${escapeHtml(exam.notes || 'No special notes provided.')}</p>
          </div>

          <div class="exam-footer-actions">
            <span>Coursework Exam</span>
            <div class="task-actions">
              <button class="action-btn-sm edit-exam-btn" data-exam-id="${exam.id}" title="Edit Exam" aria-label="Edit Exam">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="action-btn-sm delete delete-exam-btn" data-exam-id="${exam.id}" title="Delete Exam" aria-label="Delete Exam">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    elements.examsGrid.querySelectorAll('.edit-exam-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openEditExamModal(btn.getAttribute('data-exam-id'));
      });
    });

    elements.examsGrid.querySelectorAll('.delete-exam-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        promptDeleteExam(btn.getAttribute('data-exam-id'));
      });
    });
  }

  function openCreateExamModal() {
    elements.examForm.reset();
    elements.examId.value = '';
    elements.examModalTitle.textContent = 'Schedule New Exam';
    elements.examNameError.textContent = '';
    elements.examSubjectError.textContent = '';
    elements.examDateError.textContent = '';
    elements.examDate.value = datePlusDays(14);
    openModal(elements.examModal);
  }

  function openEditExamModal(examId) {
    const exam = (appState.exams || []).find(e => e.id === examId);
    if (!exam) return;

    elements.examId.value = exam.id;
    elements.examName.value = exam.name;
    elements.examSubject.value = exam.subject;
    elements.examDate.value = exam.date;
    elements.examNotes.value = exam.notes || '';
    elements.examModalTitle.textContent = 'Edit Exam Details';

    elements.examNameError.textContent = '';
    elements.examSubjectError.textContent = '';
    elements.examDateError.textContent = '';

    openModal(elements.examModal);
  }

  function promptDeleteExam(examId) {
    const exam = (appState.exams || []).find(e => e.id === examId);
    if (!exam) return;

    showConfirmDialog(`Delete exam record for "${exam.name}"?`, () => {
      appState.exams = appState.exams.filter(e => e.id !== examId);
      saveState();
      renderExams();
      renderDashboard();
      showToast('Exam removed from planner', 'info');
    });
  }

  elements.examForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameVal = elements.examName.value.trim();
    const subjectVal = elements.examSubject.value.trim();
    const dateVal = elements.examDate.value;

    elements.examNameError.textContent = '';
    elements.examSubjectError.textContent = '';
    elements.examDateError.textContent = '';

    if (!nameVal) {
      elements.examNameError.textContent = 'Please enter an exam name.';
      isValid = false;
    }
    if (!subjectVal) {
      elements.examSubjectError.textContent = 'Please enter the subject.';
      isValid = false;
    }
    if (!dateVal) {
      elements.examDateError.textContent = 'Please select the exam date.';
      isValid = false;
    }

    if (!isValid) return;

    const editId = elements.examId.value;
    if (editId) {
      const exam = appState.exams.find(e => e.id === editId);
      if (exam) {
        exam.name = nameVal;
        exam.subject = subjectVal;
        exam.date = dateVal;
        exam.notes = elements.examNotes.value.trim();
        showToast('Exam details updated!', 'success');
      }
    } else {
      const newExam = {
        id: 'exam-' + Date.now(),
        name: nameVal,
        subject: subjectVal,
        date: dateVal,
        notes: elements.examNotes.value.trim()
      };
      appState.exams.push(newExam);
      showToast('Exam scheduled successfully!', 'success');
    }

    saveState();
    closeModal(elements.examModal);
    renderExams();
    renderDashboard();
  });

  elements.openAddExamModalBtn.addEventListener('click', openCreateExamModal);

  // --- WEEKLY TIMETABLE ---
  let selectedTimetableDay = 'Monday';

  function renderTimetable() {
    let classes = [...(appState.timetable || [])];

    if (selectedTimetableDay !== 'all') {
      classes = classes.filter(c => c.day.toLowerCase() === selectedTimetableDay.toLowerCase());
      elements.currentDayViewTitle.textContent = `${selectedTimetableDay}'s Schedule`;
      elements.currentDayClassCount.textContent = `${classes.length} Class${classes.length !== 1 ? 'es' : ''} Scheduled`;
    } else {
      elements.currentDayViewTitle.textContent = 'Full Week Schedule (Mon - Sat)';
      elements.currentDayClassCount.textContent = `${classes.length} Total Weekly Classes`;
    }

    // Sort by day order then start time
    const dayOrder = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    classes.sort((a, b) => {
      const dayDiff = (dayOrder[a.day] || 0) - (dayOrder[b.day] || 0);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    if (classes.length === 0) {
      elements.timetableList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <div class="empty-title">No classes on ${selectedTimetableDay}</div>
          <p class="empty-desc">Add your lectures, seminars, or lab practicals for this day.</p>
          <button class="btn btn-primary" id="emptyStateAddClassBtn">Add Class Entry</button>
        </div>
      `;
      const btn = document.getElementById('emptyStateAddClassBtn');
      if (btn) btn.addEventListener('click', openCreateClassModal);
      return;
    }

    elements.timetableList.innerHTML = classes.map(cls => `
      <div class="timetable-item-card" id="tt-item-${cls.id}">
        <div class="timetable-time-col">
          <div>${escapeHtml(cls.startTime)} &ndash; ${escapeHtml(cls.endTime)}</div>
          ${selectedTimetableDay === 'all' ? `<span class="task-subject-tag" style="margin-top: 4px;">${escapeHtml(cls.day)}</span>` : ''}
        </div>

        <div class="timetable-info-col">
          <h4>${escapeHtml(cls.subject)}</h4>
          <p>📍 ${escapeHtml(cls.room || 'Classroom not specified')}</p>
        </div>

        <div class="task-actions">
          <button class="action-btn-sm edit-class-btn" data-class-id="${cls.id}" title="Edit Class" aria-label="Edit Class">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-btn-sm delete delete-class-btn" data-class-id="${cls.id}" title="Delete Class" aria-label="Delete Class">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    elements.timetableList.querySelectorAll('.edit-class-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openEditClassModal(btn.getAttribute('data-class-id'));
      });
    });

    elements.timetableList.querySelectorAll('.delete-class-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        promptDeleteClass(btn.getAttribute('data-class-id'));
      });
    });
  }

  // Day Tab Click Handler
  elements.dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.dayTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedTimetableDay = tab.getAttribute('data-day');
      renderTimetable();
    });
  });

  // Check for class time overlap on same day
  function checkClassOverlap(day, startTime, endTime, excludeId = null) {
    const existing = (appState.timetable || []).filter(c => c.day === day && c.id !== excludeId);

    for (const c of existing) {
      // Overlap formula: (startA < endB) and (endA > startB)
      if (startTime < c.endTime && endTime > c.startTime) {
        return c;
      }
    }
    return null;
  }

  function openCreateClassModal() {
    elements.classForm.reset();
    elements.classId.value = '';
    elements.classModalTitle.textContent = 'Add Class to Timetable';
    elements.classSubjectError.textContent = '';
    elements.classStartTimeError.textContent = '';
    elements.classEndTimeError.textContent = '';
    elements.classOverlapAlert.style.display = 'none';

    if (selectedTimetableDay !== 'all') {
      elements.classDay.value = selectedTimetableDay;
    } else {
      elements.classDay.value = 'Monday';
    }

    elements.classStartTime.value = '10:00';
    elements.classEndTime.value = '11:30';
    openModal(elements.classModal);
  }

  function openEditClassModal(classId) {
    const cls = (appState.timetable || []).find(c => c.id === classId);
    if (!cls) return;

    elements.classId.value = cls.id;
    elements.classSubject.value = cls.subject;
    elements.classDay.value = cls.day;
    elements.classRoom.value = cls.room || '';
    elements.classStartTime.value = cls.startTime;
    elements.classEndTime.value = cls.endTime;
    elements.classModalTitle.textContent = 'Edit Timetable Entry';

    elements.classSubjectError.textContent = '';
    elements.classStartTimeError.textContent = '';
    elements.classEndTimeError.textContent = '';
    elements.classOverlapAlert.style.display = 'none';

    openModal(elements.classModal);
  }

  function promptDeleteClass(classId) {
    const cls = (appState.timetable || []).find(c => c.id === classId);
    if (!cls) return;

    showConfirmDialog(`Remove "${cls.subject}" from ${cls.day}'s timetable?`, () => {
      appState.timetable = appState.timetable.filter(c => c.id !== classId);
      saveState();
      renderTimetable();
      renderDashboard();
      showToast('Class removed', 'info');
    });
  }

  // Real-time overlap check in form
  function triggerOverlapCheck() {
    const day = elements.classDay.value;
    const start = elements.classStartTime.value;
    const end = elements.classEndTime.value;
    const editId = elements.classId.value;

    if (day && start && end && start < end) {
      const clash = checkClassOverlap(day, start, end, editId);
      if (clash) {
        elements.classOverlapMessage.textContent = `Warning: Overlaps with "${clash.subject}" (${clash.startTime} - ${clash.endTime}) on ${day}.`;
        elements.classOverlapAlert.style.display = 'flex';
      } else {
        elements.classOverlapAlert.style.display = 'none';
      }
    }
  }

  elements.classDay.addEventListener('change', triggerOverlapCheck);
  elements.classStartTime.addEventListener('change', triggerOverlapCheck);
  elements.classEndTime.addEventListener('change', triggerOverlapCheck);

  elements.classForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const subjectVal = elements.classSubject.value.trim();
    const dayVal = elements.classDay.value;
    const startVal = elements.classStartTime.value;
    const endVal = elements.classEndTime.value;

    elements.classSubjectError.textContent = '';
    elements.classStartTimeError.textContent = '';
    elements.classEndTimeError.textContent = '';

    if (!subjectVal) {
      elements.classSubjectError.textContent = 'Please enter a subject name.';
      isValid = false;
    }
    if (!startVal) {
      elements.classStartTimeError.textContent = 'Please pick a start time.';
      isValid = false;
    }
    if (!endVal) {
      elements.classEndTimeError.textContent = 'Please pick an end time.';
      isValid = false;
    }
    if (startVal && endVal && startVal >= endVal) {
      elements.classEndTimeError.textContent = 'End time must be after start time.';
      isValid = false;
    }

    if (!isValid) return;

    const editId = elements.classId.value;

    // Save or Update
    if (editId) {
      const cls = appState.timetable.find(c => c.id === editId);
      if (cls) {
        cls.subject = subjectVal;
        cls.day = dayVal;
        cls.room = elements.classRoom.value.trim();
        cls.startTime = startVal;
        cls.endTime = endVal;
        showToast('Timetable entry updated!', 'success');
      }
    } else {
      const newClass = {
        id: 'tt-' + Date.now(),
        subject: subjectVal,
        day: dayVal,
        room: elements.classRoom.value.trim(),
        startTime: startVal,
        endTime: endVal
      };
      appState.timetable.push(newClass);
      showToast(`Class added to ${dayVal}'s schedule!`, 'success');
    }

    saveState();
    closeModal(elements.classModal);
    renderTimetable();
    renderDashboard();
  });

  elements.openAddClassModalBtn.addEventListener('click', openCreateClassModal);

  // --- DAILY STUDY GOALS & STREAKS ---
  function renderGoals() {
    const todayStr = toISODate(new Date());
    const target = Number(appState.dailyTargetMinutes) || 120;
    elements.goalTargetDisplay.textContent = `${target} min`;

    // Today's study time
    const todayLogs = (appState.studyLogs || []).filter(l => l.date === todayStr);
    const studiedMinutes = todayLogs.reduce((sum, l) => sum + (Number(l.minutes) || 0), 0);
    elements.goalTodayStudied.textContent = `${studiedMinutes} min`;

    const percent = Math.min(100, Math.round((studiedMinutes / target) * 100));
    elements.goalBigProgressBar.style.width = `${percent}%`;
    elements.goalProgressSubtext.textContent = `${percent}% of daily goal completed`;

    const remaining = Math.max(0, target - studiedMinutes);
    if (remaining === 0) {
      elements.goalRemainingText.textContent = 'Goal Achieved! 🏆';
      elements.goalRemainingText.className = 'badge-priority high';
      elements.goalRemainingText.style.background = 'var(--color-success-bg)';
      elements.goalRemainingText.style.color = 'var(--color-success)';
      elements.goalStatusBadge.textContent = 'Target Met! Great work!';
      elements.goalStatusBadge.className = 'stat-detail text-success';
    } else {
      elements.goalRemainingText.textContent = `${remaining} min remaining`;
      elements.goalRemainingText.className = 'badge-priority low';
      elements.goalStatusBadge.textContent = `${remaining} min left to target`;
      elements.goalStatusBadge.className = 'stat-detail text-amber';
    }

    // Tasks completed today
    const completedToday = (appState.tasks || []).filter(t => t.completed && t.completedAt === todayStr).length;
    elements.goalTasksCompletedToday.textContent = completedToday;

    // Study streak
    elements.goalStreakDisplay.textContent = `${appState.streak || 1} Day${(appState.streak || 1) !== 1 ? 's' : ''}`;

    // Recent Logs list
    const logs = [...(appState.studyLogs || [])].reverse().slice(0, 8);
    if (logs.length === 0) {
      elements.studyLogsList.innerHTML = `
        <div class="empty-state" style="padding: 20px;">
          <div class="empty-icon" style="font-size: 1.8rem;">📖</div>
          <div class="empty-title">No study sessions recorded yet</div>
          <p class="empty-desc">Log your study hours manually or use the Focus Pomodoro Timer.</p>
        </div>
      `;
      return;
    }

    elements.studyLogsList.innerHTML = logs.map(log => `
      <div class="study-log-item" id="log-item-${log.id}">
        <div>
          <div class="study-log-title">${escapeHtml(log.subject)}</div>
          <div class="study-log-meta">📅 ${escapeHtml(log.date)}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="study-log-time">+${log.minutes} mins</span>
          <button class="action-btn-sm delete delete-log-btn" data-log-id="${log.id}" title="Delete session" aria-label="Delete session">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    elements.studyLogsList.querySelectorAll('.delete-log-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const logId = btn.getAttribute('data-log-id');
        appState.studyLogs = appState.studyLogs.filter(l => l.id !== logId);
        saveState();
        renderGoals();
        renderDashboard();
        showToast('Study log removed', 'info');
      });
    });
  }

  // Change Daily Target Goal
  elements.changeGoalBtn.addEventListener('click', () => {
    elements.dailyTargetMinutes.value = appState.dailyTargetMinutes || 120;
    openModal(elements.goalModal);
  });

  elements.goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = Number(elements.dailyTargetMinutes.value);
    if (val && val >= 15) {
      appState.dailyTargetMinutes = val;
      saveState();
      closeModal(elements.goalModal);
      renderGoals();
      renderDashboard();
      showToast(`Daily study target set to ${val} minutes!`, 'success');
    }
  });

  // Manual Log Study Session
  elements.openLogSessionModalBtn.addEventListener('click', () => {
    elements.logSessionForm.reset();
    elements.logSessionDate.value = toISODate(new Date());
    elements.logSessionMinutes.value = '45';
    elements.logSessionSubjectError.textContent = '';
    elements.logSessionMinutesError.textContent = '';
    openModal(elements.logSessionModal);
  });

  elements.logSessionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const subject = elements.logSessionSubject.value.trim();
    const minutes = Number(elements.logSessionMinutes.value);
    const date = elements.logSessionDate.value;

    elements.logSessionSubjectError.textContent = '';
    elements.logSessionMinutesError.textContent = '';

    if (!subject) {
      elements.logSessionSubjectError.textContent = 'Please enter what you studied.';
      isValid = false;
    }
    if (!minutes || minutes <= 0) {
      elements.logSessionMinutesError.textContent = 'Enter a valid number of minutes.';
      isValid = false;
    }

    if (!isValid) return;

    const newLog = {
      id: 'log-' + Date.now(),
      subject: subject,
      minutes: minutes,
      date: date || toISODate(new Date())
    };

    appState.studyLogs.push(newLog);
    saveState();
    closeModal(elements.logSessionModal);
    renderGoals();
    renderDashboard();
    showToast(`Logged ${minutes} minutes of study! 📚`, 'success');
  });

  // --- FOCUS TIMER (POMODORO) ---
  const TIMER_CONFIG = {
    study: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  let currentTimerMode = 'study';
  let timerRemainingSeconds = TIMER_CONFIG.study;
  let timerInterval = null;
  let isTimerRunning = false;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 115; // r=115 -> ~722.56

  function initTimer() {
    elements.timerProgressCircle.style.strokeDasharray = CIRCLE_CIRCUMFERENCE;
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const mins = Math.floor(timerRemainingSeconds / 60);
    const secs = timerRemainingSeconds % 60;
    elements.timerTimeDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Calculate circular stroke offset
    const totalDuration = TIMER_CONFIG[currentTimerMode];
    const fraction = timerRemainingSeconds / totalDuration;
    const offset = CIRCLE_CIRCUMFERENCE * (1 - fraction);
    elements.timerProgressCircle.style.strokeDashoffset = offset;
  }

  function switchTimerMode(mode) {
    if (isTimerRunning) {
      pauseTimer();
    }
    currentTimerMode = mode;
    timerRemainingSeconds = TIMER_CONFIG[mode];

    elements.modeStudyBtn.classList.toggle('active', mode === 'study');
    elements.modeShortBreakBtn.classList.toggle('active', mode === 'shortBreak');
    elements.modeLongBreakBtn.classList.toggle('active', mode === 'longBreak');

    if (mode === 'study') {
      elements.timerModeLabel.textContent = 'STUDY SESSION';
      elements.timerProgressCircle.style.stroke = 'var(--primary-600)';
    } else if (mode === 'shortBreak') {
      elements.timerModeLabel.textContent = 'SHORT BREAK';
      elements.timerProgressCircle.style.stroke = 'var(--color-success)';
    } else {
      elements.timerModeLabel.textContent = 'LONG BREAK';
      elements.timerProgressCircle.style.stroke = 'var(--primary-500)';
    }

    updateTimerDisplay();
  }

  elements.modeStudyBtn.addEventListener('click', () => switchTimerMode('study'));
  elements.modeShortBreakBtn.addEventListener('click', () => switchTimerMode('shortBreak'));
  elements.modeLongBreakBtn.addEventListener('click', () => switchTimerMode('longBreak'));

  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    elements.timerStartBtn.style.display = 'none';
    elements.timerPauseBtn.style.display = 'inline-flex';

    timerInterval = setInterval(() => {
      if (timerRemainingSeconds > 0) {
        timerRemainingSeconds--;
        updateTimerDisplay();
      } else {
        finishTimer();
      }
    }, 1000);
  }

  function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    elements.timerStartBtn.style.display = 'inline-flex';
    elements.timerPauseBtn.style.display = 'none';
  }

  function resetTimer() {
    pauseTimer();
    timerRemainingSeconds = TIMER_CONFIG[currentTimerMode];
    updateTimerDisplay();
  }

  // Web Audio API Synthesized Chime (Works offline without external audio files)
  function playAudioAlert() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio Context notification unsupported or blocked:', e);
    }
  }

  function finishTimer() {
    pauseTimer();
    playAudioAlert();

    if (currentTimerMode === 'study') {
      const subject = elements.timerSubjectInput.value.trim() || 'Focused Study';
      showToast(`Pomodoro Finished: 25 minutes of deep focus on "${subject}"! 🎉 Take a 5m break.`, 'success');

      // Auto-log to Daily Study Goals if checked
      if (elements.autoLogTimerSession.checked) {
        const newLog = {
          id: 'log-' + Date.now(),
          subject: subject,
          minutes: 25,
          date: toISODate(new Date())
        };
        appState.studyLogs.push(newLog);
        saveState();
        renderGoals();
        renderDashboard();
      }

      // Prompt to switch to break
      setTimeout(() => {
        switchTimerMode('shortBreak');
      }, 1000);
    } else {
      showToast('Break finished! Ready for your next focus session? 💪', 'info');
      setTimeout(() => {
        switchTimerMode('study');
      }, 1000);
    }
  }

  elements.timerStartBtn.addEventListener('click', startTimer);
  elements.timerPauseBtn.addEventListener('click', pauseTimer);
  elements.timerResetBtn.addEventListener('click', resetTimer);

  // --- INITIALIZATION ---
  function init() {
    loadState();
    renderProfile();
    randomizeQuote();
    initTimer();

    // Initial render of all sections
    renderDashboard();
    renderTasks();
    renderExams();
    renderTimetable();
    renderGoals();

    // Check location hash for active section
    const hash = window.location.hash.replace('#', '');
    if (hash && ['dashboard', 'tasks', 'exams', 'timetable', 'goals', 'timer'].includes(hash)) {
      switchSection(hash);
    } else {
      switchSection('dashboard');
    }
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
