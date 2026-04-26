"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    await prisma.medicine.deleteMany();
    await prisma.prescription.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.timeSlot.deleteMany();
    await prisma.doctorSlot.deleteMany();
    await prisma.patientVital.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctorClinic.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.clinicAdmin.deleteMany();
    await prisma.clinic.deleteMany();
    await prisma.speciality.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.blogPost.deleteMany();
    await prisma.user.deleteMany();
    const hashedPassword = async (pwd) => bcrypt.hash(pwd, 10);
    console.log('Creating specialities...');
    const specialities = await Promise.all([
        prisma.speciality.create({ data: { name: 'Cardiology', slug: 'cardiology', description: 'Heart and cardiovascular system specialists', icon: '🫀', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400' } }),
        prisma.speciality.create({ data: { name: 'Dermatology', slug: 'dermatology', description: 'Skin, hair and nail specialists', icon: '🧴', image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400' } }),
        prisma.speciality.create({ data: { name: 'Neurology', slug: 'neurology', description: 'Brain and nervous system specialists', icon: '🧠', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400' } }),
        prisma.speciality.create({ data: { name: 'Orthopedics', slug: 'orthopedics', description: 'Bone and joint specialists', icon: '🦴', image: 'https://images.unsplash.com/photo-1583912086096-8c60d75a53f9?w=400' } }),
        prisma.speciality.create({ data: { name: 'Pediatrics', slug: 'pediatrics', description: 'Child health specialists', icon: '👶', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400' } }),
        prisma.speciality.create({ data: { name: 'Gynecology', slug: 'gynecology', description: "Women's health specialists", icon: '🌸', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400' } }),
        prisma.speciality.create({ data: { name: 'Psychiatry', slug: 'psychiatry', description: 'Mental health specialists', icon: '🧘', image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=400' } }),
        prisma.speciality.create({ data: { name: 'General Medicine', slug: 'general-medicine', description: 'General health practitioners', icon: '🏥', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400' } }),
    ]);
    console.log('Creating super admin...');
    const adminUser = await prisma.user.create({
        data: {
            id: (0, uuid_1.v4)(),
            email: 'admin@demo.com',
            password: await hashedPassword('Admin@123'),
            firstName: 'Super',
            lastName: 'Admin',
            role: client_1.Role.SUPER_ADMIN,
            isVerified: true,
            isActive: true,
            gender: client_1.Gender.MALE,
        },
    });
    console.log('Creating clinics...');
    const clinic1 = await prisma.clinic.create({
        data: {
            name: 'Apollo MediCare Clinic',
            slug: 'apollo-medicare-clinic',
            description: 'State-of-the-art multi-specialty clinic with 50+ specialists',
            address: '42, Connaught Place',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110001',
            phone: '+91 11 4567 8901',
            email: 'info@apollomedicare.in',
            website: 'https://apollomedicare.in',
            logo: 'https://ui-avatars.com/api/?name=Apollo+Medicare&background=0D8ABC&color=fff&size=200',
        },
    });
    const clinic2 = await prisma.clinic.create({
        data: {
            name: 'Fortis HealthCare Hub',
            slug: 'fortis-healthcare-hub',
            description: 'Premium healthcare facility with advanced diagnostic center',
            address: '17, Linking Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400054',
            phone: '+91 22 6789 0123',
            email: 'care@fortishealthhub.in',
            website: 'https://fortishealthhub.in',
            logo: 'https://ui-avatars.com/api/?name=Fortis+Health&background=2563EB&color=fff&size=200',
        },
    });
    console.log('Creating clinic admins...');
    const clinicAdminUser = await prisma.user.create({
        data: {
            email: 'clinicadmin@demo.com',
            password: await hashedPassword('Clinic@123'),
            firstName: 'Rahul',
            lastName: 'Sharma',
            role: client_1.Role.CLINIC_ADMIN,
            isVerified: true,
            isActive: true,
            gender: client_1.Gender.MALE,
        },
    });
    await prisma.clinicAdmin.create({
        data: { userId: clinicAdminUser.id, clinicId: clinic1.id },
    });
    console.log('Creating doctors...');
    const doctorUser1 = await prisma.user.create({
        data: {
            email: 'doctor@demo.com',
            password: await hashedPassword('Doctor@123'),
            firstName: 'Arjun',
            lastName: 'Mehta',
            role: client_1.Role.DOCTOR,
            isVerified: true,
            isActive: true,
            gender: client_1.Gender.MALE,
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
    });
    const doctor1 = await prisma.doctor.create({
        data: {
            userId: doctorUser1.id,
            specialityId: specialities[0].id,
            registrationNo: 'MCI-2024-001',
            experience: 12,
            about: 'Dr. Arjun Mehta is a board-certified cardiologist with 12 years of experience in interventional cardiology. He specializes in complex coronary interventions and structural heart disease.',
            education: JSON.stringify([
                { degree: 'MBBS', institution: 'AIIMS Delhi', year: 2008 },
                { degree: 'MD Medicine', institution: 'AIIMS Delhi', year: 2011 },
                { degree: 'DM Cardiology', institution: 'PGIMER Chandigarh', year: 2014 },
            ]),
            languages: JSON.stringify(['English', 'Hindi', 'Gujarati']),
            consultationFee: 800,
            followUpFee: 400,
            rating: 4.8,
            totalReviews: 342,
            bookingUrl: 'dr-arjun-mehta',
            isVerified: true,
        },
    });
    const doctorUser2 = await prisma.user.create({
        data: {
            email: 'doctor2@demo.com',
            password: await hashedPassword('Doctor@123'),
            firstName: 'Priya',
            lastName: 'Patel',
            role: client_1.Role.DOCTOR,
            isVerified: true,
            isActive: true,
            gender: client_1.Gender.FEMALE,
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
    });
    const doctor2 = await prisma.doctor.create({
        data: {
            userId: doctorUser2.id,
            specialityId: specialities[1].id,
            registrationNo: 'MCI-2024-002',
            experience: 8,
            about: 'Dr. Priya Patel is a renowned dermatologist specializing in cosmetic dermatology and skin disorders. She has expertise in laser treatments and anti-aging procedures.',
            education: JSON.stringify([
                { degree: 'MBBS', institution: 'Seth GS Medical College, Mumbai', year: 2012 },
                { degree: 'MD Dermatology', institution: 'KEM Hospital, Mumbai', year: 2015 },
            ]),
            languages: JSON.stringify(['English', 'Hindi', 'Gujarati', 'Marathi']),
            consultationFee: 600,
            followUpFee: 300,
            rating: 4.9,
            totalReviews: 518,
            bookingUrl: 'dr-priya-patel',
            isVerified: true,
        },
    });
    const doctorUser3 = await prisma.user.create({
        data: {
            email: 'doctor3@demo.com',
            password: await hashedPassword('Doctor@123'),
            firstName: 'Vikram',
            lastName: 'Singh',
            role: client_1.Role.DOCTOR,
            isVerified: true,
            isActive: true,
            gender: client_1.Gender.MALE,
            avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        },
    });
    const doctor3 = await prisma.doctor.create({
        data: {
            userId: doctorUser3.id,
            specialityId: specialities[2].id,
            registrationNo: 'MCI-2024-003',
            experience: 15,
            about: 'Dr. Vikram Singh is a leading neurologist with expertise in epilepsy, stroke management, and movement disorders. He has published over 50 research papers in international journals.',
            education: JSON.stringify([
                { degree: 'MBBS', institution: 'Grant Medical College, Mumbai', year: 2005 },
                { degree: 'MD Medicine', institution: 'PGIMER Chandigarh', year: 2008 },
                { degree: 'DM Neurology', institution: 'NIMHANS Bangalore', year: 2011 },
            ]),
            languages: JSON.stringify(['English', 'Hindi', 'Punjabi']),
            consultationFee: 1000,
            followUpFee: 500,
            rating: 4.7,
            totalReviews: 289,
            bookingUrl: 'dr-vikram-singh',
            isVerified: true,
        },
    });
    const doctorUser4 = await prisma.user.create({
        data: {
            email: 'doctor4@demo.com',
            password: await hashedPassword('Doctor@123'),
            firstName: 'Anita',
            lastName: 'Krishnan',
            role: client_1.Role.DOCTOR,
            isVerified: true,
            isActive: true,
            gender: client_1.Gender.FEMALE,
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        },
    });
    const doctor4 = await prisma.doctor.create({
        data: {
            userId: doctorUser4.id,
            specialityId: specialities[4].id,
            registrationNo: 'MCI-2024-004',
            experience: 10,
            about: 'Dr. Anita Krishnan is a compassionate pediatrician dedicated to child health. She specializes in newborn care, developmental pediatrics, and childhood immunization programs.',
            education: JSON.stringify([
                { degree: 'MBBS', institution: 'Christian Medical College, Vellore', year: 2010 },
                { degree: 'MD Pediatrics', institution: 'AIIMS Delhi', year: 2013 },
            ]),
            languages: JSON.stringify(['English', 'Hindi', 'Tamil', 'Telugu']),
            consultationFee: 500,
            followUpFee: 250,
            rating: 4.9,
            totalReviews: 621,
            bookingUrl: 'dr-anita-krishnan',
            isVerified: true,
        },
    });
    await prisma.doctorClinic.createMany({
        data: [
            { doctorId: doctor1.id, clinicId: clinic1.id },
            { doctorId: doctor2.id, clinicId: clinic1.id },
            { doctorId: doctor2.id, clinicId: clinic2.id },
            { doctorId: doctor3.id, clinicId: clinic2.id },
            { doctorId: doctor4.id, clinicId: clinic1.id },
            { doctorId: doctor4.id, clinicId: clinic2.id },
        ],
    });
    console.log('Creating doctor slots...');
    const days = [client_1.DayOfWeek.MONDAY, client_1.DayOfWeek.TUESDAY, client_1.DayOfWeek.WEDNESDAY, client_1.DayOfWeek.THURSDAY, client_1.DayOfWeek.FRIDAY, client_1.DayOfWeek.SATURDAY];
    for (const doctor of [doctor1, doctor2, doctor3, doctor4]) {
        for (const day of days) {
            await prisma.doctorSlot.create({
                data: {
                    doctorId: doctor.id,
                    day,
                    startTime: '10:00',
                    endTime: '13:00',
                    duration: 30,
                    isActive: true,
                },
            });
            if (day !== client_1.DayOfWeek.SATURDAY) {
                await prisma.doctorSlot.create({
                    data: {
                        doctorId: doctor.id,
                        day,
                        startTime: '17:00',
                        endTime: '20:00',
                        duration: 30,
                        isActive: true,
                    },
                });
            }
        }
    }
    console.log('Creating patient user...');
    const patientUser = await prisma.user.create({
        data: {
            email: 'user@demo.com',
            password: await hashedPassword('User@123'),
            firstName: 'Amit',
            lastName: 'Kumar',
            role: client_1.Role.PATIENT,
            isVerified: true,
            isActive: true,
            gender: client_1.Gender.MALE,
            phone: '+91 9876543210',
            dateOfBirth: new Date('1990-05-15'),
            avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
        },
    });
    const selfPatient = await prisma.patient.create({
        data: {
            userId: patientUser.id,
            firstName: 'Amit',
            lastName: 'Kumar',
            dateOfBirth: new Date('1990-05-15'),
            gender: client_1.Gender.MALE,
            bloodGroup: 'B+',
            relation: client_1.RelationType.SELF,
            phone: '+91 9876543210',
        },
    });
    const wifePatient = await prisma.patient.create({
        data: {
            userId: patientUser.id,
            firstName: 'Sunita',
            lastName: 'Kumar',
            dateOfBirth: new Date('1993-08-22'),
            gender: client_1.Gender.FEMALE,
            bloodGroup: 'O+',
            relation: client_1.RelationType.SPOUSE,
        },
    });
    console.log('Creating sample appointment...');
    const appointment = await prisma.appointment.create({
        data: {
            appointmentNo: 'APT-2024-001',
            userId: patientUser.id,
            patientId: selfPatient.id,
            doctorId: doctor1.id,
            clinicId: clinic1.id,
            scheduledDate: new Date(),
            scheduledTime: '10:00',
            status: 'CONFIRMED',
            paymentMode: 'PAY_AT_CLINIC',
            notes: 'Routine cardiac checkup',
        },
    });
    await prisma.payment.create({
        data: {
            appointmentId: appointment.id,
            userId: patientUser.id,
            amount: 800,
            status: 'PAID',
            paymentMode: 'PAY_AT_CLINIC',
            paidAt: new Date(),
        },
    });
    console.log('Creating reviews...');
    await prisma.review.create({
        data: {
            userId: patientUser.id,
            doctorId: doctor1.id,
            appointmentId: appointment.id,
            rating: 5,
            comment: 'Excellent doctor! Very thorough and explained everything clearly. Highly recommend.',
            isApproved: true,
        },
    });
    console.log('Creating blog posts...');
    await prisma.blogPost.createMany({
        data: [
            {
                title: '10 Tips for a Healthy Heart',
                slug: '10-tips-for-a-healthy-heart',
                excerpt: 'Discover simple lifestyle changes that can dramatically improve your cardiovascular health.',
                content: '<h2>Introduction</h2><p>Heart disease remains the leading cause of death globally. But the good news is that most heart diseases are preventable with the right lifestyle choices...</p><h2>1. Exercise Regularly</h2><p>Aim for at least 150 minutes of moderate aerobic activity per week...</p>',
                coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
                tags: JSON.stringify(['cardiology', 'heart health', 'lifestyle']),
                authorId: adminUser.id,
                isPublished: true,
                publishedAt: new Date(),
            },
            {
                title: 'Understanding Childhood Vaccines',
                slug: 'understanding-childhood-vaccines',
                excerpt: 'A comprehensive guide for parents about the importance of timely vaccinations.',
                content: '<h2>Why Vaccines Matter</h2><p>Vaccines have been one of the greatest public health achievements of the 20th century...</p>',
                coverImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
                tags: JSON.stringify(['pediatrics', 'vaccines', 'child health']),
                authorId: adminUser.id,
                isPublished: true,
                publishedAt: new Date(),
            },
            {
                title: 'Managing Skin During Monsoon Season',
                slug: 'managing-skin-during-monsoon',
                excerpt: 'Expert tips from dermatologists on keeping your skin healthy during the rainy season.',
                content: '<h2>Monsoon Skin Challenges</h2><p>The humid monsoon season brings unique challenges for skin health...</p>',
                coverImage: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800',
                tags: JSON.stringify(['dermatology', 'skin care', 'monsoon']),
                authorId: adminUser.id,
                isPublished: true,
                publishedAt: new Date(),
            },
        ],
    });
    console.log('✅ Seed completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin: admin@demo.com / Admin@123');
    console.log('Clinic Admin: clinicadmin@demo.com / Clinic@123');
    console.log('Doctor: doctor@demo.com / Doctor@123');
    console.log('Patient: user@demo.com / User@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map