import { create } from 'zustand';

const useTeacherStore = create((set) => ({
    profile: null,
    courses: [],
    assignments: [],
    submissions: {}, // Map of assignmentId -> submissions[]
    courseStudents: {}, // Map of courseId -> enrollments[]

    setProfile: (profile) => set({ profile }),
    setCourses: (courses) => set({ courses }),
    setAssignments: (assignments) => set({ assignments }),

    setSubmissions: (assignmentId, subs) => set((state) => ({
        submissions: { ...state.submissions, [assignmentId]: subs }
    })),

    setCourseStudents: (courseId, students) => set((state) => ({
        courseStudents: { ...state.courseStudents, [courseId]: students }
    })),
}));

export default useTeacherStore;
