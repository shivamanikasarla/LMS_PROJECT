import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExamLayout from "./layouts/ExamLayout";
import ExamDashboard from "./dashboard/ExamDashboard";
import QuestionBank from "./question-bank/QuestionBank";
import CreateExam from "./create-exam/CreateExam";
import ExamSchedule from "./schedule/ExamSchedule";
import ReattemptRules from "./reattempt/ReattemptRules";
import ExamReports from "./reports/ExamReports";
import Leaderboard from "./leaderboard/Leaderboard";
import ExamSettings from "./settings/ExamSettings";
import ExamPaperView from "./preview/ExamPaperView";
import LearnerExamView from "./learner/LearnerExamView";
import StudentExamDashboard from "./student/StudentExamDashboard";
import SectionBasedExamPreview from "./preview/SectionBasedExamPreview";
import MNCExamView from "./learner/MNCExamView";

const Exams = () => {
    return (
        <Routes>
            <Route element={<ExamLayout />}>
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ExamDashboard />} />
                <Route path="question-bank" element={<QuestionBank />} />
                <Route path="create-exam" element={<CreateExam />} />
                <Route path="edit-exam/:id" element={<CreateExam />} />
                <Route path="schedule" element={<ExamSchedule />} />
                <Route path="reattempt" element={<ReattemptRules />} />
                <Route path="reports" element={<ExamReports />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="settings" element={<ExamSettings />} />
                <Route path="view-paper/:id" element={<ExamPaperView />} />
            </Route>

            {/* Learner/Student View (Standalone) */}
            <Route path="student/dashboard" element={<StudentExamDashboard />} />
            <Route path="student/attempt/:id" element={<LearnerExamView />} />

            {/* New Simulation Preview (Standalone) */}
            <Route path="simulation/preview" element={<SectionBasedExamPreview />} />
            <Route path="simulation/mnc-preview" element={<MNCExamView />} />
        </Routes>
    );
};

export default Exams;
