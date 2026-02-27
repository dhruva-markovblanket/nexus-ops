import { create } from 'zustand';

const useStudentStore = create((set) => ({
    profile: null,
    courses: [],
    grades: [],
    timetable: [],
    exams: [],
    assignments: [],
    attendance: [],

    setProfile: (profile) => set({ profile }),
    setCourses: (courses) => set({ courses }),
    setGrades: (grades) => set({ grades }),
    setTimetable: (timetable) => set({ timetable }),
    setExams: (exams) => set({ exams }),
    setAssignments: (assignments) => set({ assignments }),
    setAttendance: (attendance) => set({ attendance }),

    updateAssignmentSubmission: (assignmentId, submission) => set((state) => ({
        assignments: state.assignments.map(a => {
            if (a.id === assignmentId) {
                // Remove old submission if exists and append new
                const filtered = a.submissions?.filter(s => s.id !== submission.id) || [];
                return { ...a, submissions: [...filtered, submission] };
            }
            return a;
        })
    }))
}));

export default useStudentStore;
