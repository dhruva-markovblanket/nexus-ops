const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing old data...');
    await prisma.auditLog.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.timetable.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.department.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding departments...');
    const deptData = [
        { name: 'Computer Science', prefix: 'CSC' },
        { name: 'Electronics Engineering', prefix: 'ECE' },
        { name: 'Mechanical Engineering', prefix: 'MEC' }
    ];

    const defaultPassword = await bcrypt.hash('12052024', 10); // DDMMYYYY format as requested

    const depts = [];
    for (const d of deptData) {
        const dept = await prisma.department.create({
            data: { name: d.name }
        });
        depts.push({ ...dept, prefix: d.prefix });
    }

    console.log('Seeding teachers and heads of departments...');
    const teachers = [];
    for (const dept of depts) {
        for (let i = 1; i <= 5; i++) {
            const isHead = i === 1;
            const user = await prisma.user.create({
                data: {
                    name: `Teacher ${dept.prefix} 00${i}`,
                    email: `t${dept.prefix.toLowerCase()}${i}@nexus.edu`,
                    passwordHash: defaultPassword,
                    role: 'teacher',
                    departmentId: dept.id
                }
            });
            const teacher = await prisma.teacher.create({
                data: {
                    userId: user.id,
                    designation: isHead ? 'Professor & HOD' : 'Assistant Professor',
                    subjects: `${dept.name} Core ${i}, ${dept.name} Elective ${i}`
                }
            });
            teachers.push({ ...teacher, deptId: dept.id });

            if (isHead) {
                await prisma.department.update({
                    where: { id: dept.id },
                    data: { headId: teacher.id }
                });
            }
        }
    }

    console.log('Seeding courses...');
    const courses = [];
    for (const dept of depts) {
        const deptTeachers = teachers.filter(t => t.deptId === dept.id);
        for (let i = 1; i <= 6; i++) {
            const course = await prisma.course.create({
                data: {
                    name: `${dept.name} 10${i}`,
                    code: `${dept.prefix}10${i}`,
                    departmentId: dept.id,
                    teacherId: deptTeachers[Math.floor(Math.random() * deptTeachers.length)].id,
                    credits: Math.floor(Math.random() * 2) + 3, // 3 or 4 credits
                    semester: 'Fall 2026'
                }
            });
            courses.push({ ...course, deptId: dept.id });
        }
    }

    console.log('Seeding admin...');
    await prisma.user.create({
        data: {
            name: 'System Administrator',
            email: 'admin@nexus.edu',
            passwordHash: defaultPassword,
            role: 'admin'
        }
    });

    console.log('Seeding students and enrollments...');
    for (const dept of depts) {
        const deptCourses = courses.filter(c => c.deptId === dept.id);
        for (let i = 1; i <= 30; i++) {
            const user = await prisma.user.create({
                data: {
                    name: `Student ${dept.prefix} ${i.toString().padStart(3, '0')}`,
                    email: `s${dept.prefix.toLowerCase()}${i.toString().padStart(3, '0')}@nexus.edu`,
                    passwordHash: defaultPassword,
                    role: 'student',
                    departmentId: dept.id
                }
            });

            const gpa = (Math.random() * 2.0 + 2.0).toFixed(2); // 2.0 to 4.0
            const student = await prisma.student.create({
                data: {
                    userId: user.id,
                    enrollmentYear: 2024,
                    gpa: parseFloat(gpa),
                    credits: 45
                }
            });

            // Enroll in 4 random courses from their dept
            const enrollCourses = deptCourses.sort(() => 0.5 - Math.random()).slice(0, 4);
            for (const ec of enrollCourses) {
                await prisma.enrollment.create({
                    data: {
                        studentId: student.id,
                        courseId: ec.id,
                        grade: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
                        attendance: Math.floor(Math.random() * 30 + 70) // 70 to 100
                    }
                });
            }
        }
    }

    console.log('Seeding timetables...');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['08:00', '10:00', '13:00', '15:00'];
    for (const course of courses) {
        // 2 classes per week per course
        const slots = days.sort(() => 0.5 - Math.random()).slice(0, 2);
        for (const day of slots) {
            const time = times[Math.floor(Math.random() * times.length)];
            await prisma.timetable.create({
                data: {
                    courseId: course.id,
                    dayOfWeek: day,
                    startTime: time,
                    endTime: `${parseInt(time.split(':')[0]) + 1}:30`, // 1.5 hr
                    room: `Room ${Math.floor(Math.random() * 50 + 100)}`
                }
            });
        }
    }

    console.log('Seeding exams and assignments...');
    for (const course of courses) {
        await prisma.exam.create({
            data: {
                courseId: course.id,
                date: new Date('2026-12-15T09:00:00Z'),
                duration: 180,
                room: `Hall ${Math.floor(Math.random() * 5)}`,
                type: 'Final'
            }
        });

        const assignment = await prisma.assignment.create({
            data: {
                courseId: course.id,
                title: 'Midterm Project',
                description: 'Complete the midterm project covering modules 1-4.',
                dueDate: new Date('2026-10-30T23:59:59Z'),
                maxMarks: 100
            }
        });

        // Submissions for half the students enrolled
        const enrolls = await prisma.enrollment.findMany({ where: { courseId: course.id } });
        for (const e of enrolls.slice(0, Math.floor(enrolls.length / 2))) {
            await prisma.submission.create({
                data: {
                    assignmentId: assignment.id,
                    studentId: e.studentId,
                    marks: Math.floor(Math.random() * 40 + 60),
                    feedback: 'Good work.'
                }
            });
        }
    }

    console.log('Seeding announcements and audit logs...');
    const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
    await prisma.announcement.create({
        data: {
            title: 'Welcome to Fall 2026 Semester',
            body: 'Welcome to the new semester! Please check your timetables.',
            authorId: admin.id,
            targetRole: 'all'
        }
    });

    await prisma.auditLog.create({
        data: {
            userId: admin.id,
            action: 'SYSTEM_SEED',
            entity: 'Database',
            metadata: '{"seeded":true}'
        }
    });

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
