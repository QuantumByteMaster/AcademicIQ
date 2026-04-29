const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subjects: [String],
  profile: {
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      studyReminders: { type: Boolean, default: true },
    },
  },
  stats: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyStats' },
}, { timestamps: true });

const studySessionSchema = new mongoose.Schema({
  duration: Number,
  startTime: Date,
  endTime: Date,
  mode: String,
});

const dailySessionSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 },
  sessions: [studySessionSchema],
});

const studyStatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalStudyHours: { type: Number, default: 0 },
  completedSessions: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  lastStudyDate: Date,
  dailySessions: { type: Map, of: dailySessionSchema, default: new Map() },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const StudyStats = mongoose.models.StudyStats || mongoose.model('StudyStats', studyStatsSchema);

async function seedData() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    const email = "raj.screenshot@example.com";
    const passwordPlain = "Portfolio2026!";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        await StudyStats.deleteOne({ userId: existingUser._id });
        await User.deleteOne({ email });
        console.log("Removed existing user test data.");
    }

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    const user = new User({
      name: "Raj",
      email: email,
      password: hashedPassword,
      subjects: ["Computer Science", "Data Structures", "System Design"],
    });

    const stats = new StudyStats({
      userId: user._id,
      currentStreak: 14,
      bestStreak: 28,
      totalStudyHours: 0,
      completedSessions: 0,
    });

    user.stats = stats._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const generateDateStr = (daysAgo) => {
        const d = new Date(today);
        d.setDate(d.getDate() - daysAgo);
        return d.toISOString().split('T')[0];
    };

    const generateSessionsForDay = (dateStr) => {
        const count = Math.floor(Math.random() * 9) + 1; 
        let totalDuration = 0;
        const sessions = [];

        for (let i=0; i<count; i++) {
            const duration = Math.floor(Math.random() * 3600) + 1800;
            totalDuration += duration;
            const d = new Date(dateStr);
            d.setHours(10 + i, 0, 0, 0);
            const start = new Date(d);
            const end = new Date(start.getTime() + duration * 1000);

            sessions.push({
                duration,
                startTime: start,
                endTime: end,
                mode: "focus"
            });
        }
        return { count, totalDuration, sessions };
    };

    const allDays = [];
    for (let i = 0; i < 14; i++) allDays.push(i);
    for (let i = 20; i < 48; i++) allDays.push(i);
    
    let daysAgo = 50;
    while (allDays.length < 112) {
        allDays.push(daysAgo);
        daysAgo += Math.floor(Math.random() * 3) + 1;
    }

    let overallTotalHours = 0;
    let overallCompletedSessions = 0;
    let lastStudyDate = null;

    for (const d of allDays) {
        const dateStr = generateDateStr(d);
        const dayData = generateSessionsForDay(dateStr);
        stats.dailySessions.set(dateStr, dayData);

        overallTotalHours += dayData.totalDuration / 3600;
        overallCompletedSessions += dayData.count;

        if (!lastStudyDate && d === 0) {
            lastStudyDate = dayData.sessions[dayData.sessions.length - 1].endTime;
        }
    }

    stats.totalStudyHours = Math.round(overallTotalHours);
    stats.completedSessions = overallCompletedSessions;
    stats.lastStudyDate = lastStudyDate || new Date();

    await stats.save();
    await user.save();

    console.log("-----------------------------------------");
    console.log("✅ Seed Data Generated Successfully!");
    console.log("-----------------------------------------");
    console.log(`Display Name: ${user.name}`);
    console.log(`Email:        ${email}`);
    console.log(`Password:     ${passwordPlain}`);
    console.log(`Total Days:   ${stats.dailySessions.size} (Target: 112)`);
    console.log(`Current Str:  ${stats.currentStreak}`);
    console.log(`Best Streak:  ${stats.bestStreak}`);
    console.log("-----------------------------------------");

  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedData();
