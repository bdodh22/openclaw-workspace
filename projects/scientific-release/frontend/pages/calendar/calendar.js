// pages/calendar/calendar.js
Page({
  data: {
    today: '',
    isVegetarianDay: false,
    vegetarianDayDesc: '',
    currentYear: 2026,
    currentMonth: 3,
    calendarDays: [],
    vegetarianDays: [1, 8, 14, 15, 18, 23, 24, 28, 29, 30] // 十斋日
  },

  onLoad() {
    const now = new Date();
    this.setData({
      today: this.formatDate(now),
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1
    });
    this.checkToday();
    this.generateCalendar();
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  checkToday() {
    const now = new Date();
    const day = now.getDate();
    const { vegetarianDays } = this.data;
    
    const isVegetarian = vegetarianDays.includes(day) || day === 1 || day === 15;
    let desc = '普通日';
    
    if (day === 1) desc = '朔日（初一）- 十斋日';
    else if (day === 15) desc = '望日（十五）- 十斋日';
    else if ([8, 14, 23, 29, 30].includes(day)) desc = '六斋日 + 十斋日';
    else if (vegetarianDays.includes(day)) desc = '十斋日';

    this.setData({
      isVegetarianDay: isVegetarian,
      vegetarianDayDesc: desc
    });
  },

  generateCalendar() {
    const { currentYear, currentMonth } = this.data;
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();

    const days = [];
    
    // Empty cells for previous month
    for (let i = 0; i < startWeekday; i++) {
      days.push({ day: '', isVegetarian: false });
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const { vegetarianDays } = this.data;
      const isVegetarian = vegetarianDays.includes(day) || day === 1 || day === 15;
      const isToday = today.getFullYear() === currentYear && 
                      today.getMonth() + 1 === currentMonth && 
                      today.getDate() === day;

      days.push({
        day,
        isVegetarian,
        isToday
      });
    }

    this.setData({ calendarDays: days });
  },

  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    if (currentMonth === 1) {
      currentMonth = 12;
      currentYear--;
    } else {
      currentMonth--;
    }
    this.setData({ currentYear, currentMonth });
    this.generateCalendar();
  },

  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    if (currentMonth === 12) {
      currentMonth = 1;
      currentYear++;
    } else {
      currentMonth++;
    }
    this.setData({ currentYear, currentMonth });
    this.generateCalendar();
  },

  selectDay(e) {
    const day = e.currentTarget.dataset.day;
    if (!day.day) return;

    const { currentYear, currentMonth } = this.data;
    wx.showModal({
      title: `${currentYear}年${currentMonth}月${day.day}日`,
      content: day.isVegetarian ? '✓ 斋日 - 适合放生祈福' : '普通日',
      showCancel: false
    });
  }
});
