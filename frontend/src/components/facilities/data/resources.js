export const initialResources = [
  {
    id: 'RES-001',
    name: 'Advanced Robotics Lab',
    type: 'Room',
    category: 'Lab',
    location: 'Engineering Block',
    capacity: 30,
    status: 'ACTIVE',
    description:
      'State-of-the-art robotics laboratory equipped with robotic arms, sensors, and workstations for practical experiments.',
    availabilityWindows: [
      { days: 'Mon-Fri', startTime: '08:00', endTime: '18:00' },
    ],
  },
  {
    id: 'RES-002',
    name: 'Main Auditorium',
    type: 'Room',
    category: 'Lecture Hall',
    location: 'Main Campus',
    capacity: 500,
    status: 'ACTIVE',
    description:
      'Large tiered seating auditorium with dual projectors, PA system, and stage lighting.',
    availabilityWindows: [
      { days: 'Mon-Sun', startTime: '07:00', endTime: '22:00' },
    ],
  },
  {
    id: 'RES-003',
    name: '3D Printer Pro X',
    type: 'Equipment',
    category: 'Equipment',
    location: 'Engineering Block',
    capacity: 1,
    status: 'OUT_OF_SERVICE',
    description:
      'High-precision industrial 3D printer for rapid prototyping. Currently undergoing maintenance.',
    availabilityWindows: [
      { days: 'Mon-Fri', startTime: '09:00', endTime: '17:00' },
    ],
  },
  {
    id: 'RES-004',
    name: 'Software Engineering Studio',
    type: 'Room',
    category: 'Lab',
    location: 'IT Faculty',
    capacity: 45,
    status: 'ACTIVE',
    description:
      'Collaborative workspace with dual-monitor setups and agile boards.',
    availabilityWindows: [
      { days: 'Mon-Fri', startTime: '08:00', endTime: '20:00' },
    ],
  },
  {
    id: 'RES-005',
    name: 'Executive Boardroom',
    type: 'Room',
    category: 'Conference Room',
    location: 'Main Campus',
    capacity: 15,
    status: 'ACTIVE',
    description:
      'Premium meeting room with video conferencing facilities and interactive whiteboard.',
    availabilityWindows: [
      { days: 'Mon-Fri', startTime: '08:00', endTime: '17:00' },
    ],
  },
  {
    id: 'RES-006',
    name: 'Chemistry Lab B',
    type: 'Room',
    category: 'Lab',
    location: 'Science Building',
    capacity: 25,
    status: 'OUT_OF_SERVICE',
    description:
      'Standard chemistry laboratory. Closed for fume hood inspections.',
    availabilityWindows: [
      { days: 'Mon-Fri', startTime: '08:00', endTime: '16:00' },
    ],
  },
  {
    id: 'RES-007',
    name: 'Portable Projector Unit 1',
    type: 'Equipment',
    category: 'Equipment',
    location: 'IT Faculty',
    capacity: 1,
    status: 'ACTIVE',
    description:
      '4K portable projector with HDMI and wireless casting capabilities.',
    availabilityWindows: [
      { days: 'Mon-Sun', startTime: '08:00', endTime: '20:00' },
    ],
  },
  {
    id: 'RES-008',
    name: 'Physics Lecture Theatre',
    type: 'Room',
    category: 'Lecture Hall',
    location: 'Science Building',
    capacity: 120,
    status: 'ACTIVE',
    description:
      'Medium-sized lecture theatre with demonstration desk and multiple displays.',
    availabilityWindows: [
      { days: 'Mon-Fri', startTime: '08:00', endTime: '18:00' },
    ],
  },
  {
    id: 'RES-009',
    name: 'Woodworking Workshop',
    type: 'Room',
    category: 'Workshop',
    location: 'Engineering Block',
    capacity: 20,
    status: 'ACTIVE',
    description:
      'Fully equipped workshop with lathes, saws, and safety equipment.',
    availabilityWindows: [
      { days: 'Mon-Thu', startTime: '09:00', endTime: '17:00' },
    ],
  },
  {
    id: 'RES-010',
    name: 'VR Headset Kit',
    type: 'Equipment',
    category: 'Equipment',
    location: 'IT Faculty',
    capacity: 1,
    status: 'ACTIVE',
    description: 'Meta Quest Pro headset with controllers and charging dock.',
    availabilityWindows: [
      { days: 'Mon-Fri', startTime: '10:00', endTime: '16:00' },
    ],
  },
  {
    id: 'RES-011',
    name: 'Seminar Room 4',
    type: 'Room',
    category: 'Conference Room',
    location: 'Main Campus',
    capacity: 30,
    status: 'ACTIVE',
    description:
      'Flexible seating seminar room suitable for group discussions.',
    availabilityWindows: [
      { days: 'Mon-Fri', startTime: '08:00', endTime: '19:00' },
    ],
  },
  {
    id: 'RES-012',
    name: 'Electron Microscope',
    type: 'Equipment',
    category: 'Equipment',
    location: 'Science Building',
    capacity: 1,
    status: 'OUT_OF_SERVICE',
    description: 'Scanning electron microscope. Awaiting calibration.',
    availabilityWindows: [
      { days: 'Tue-Thu', startTime: '09:00', endTime: '15:00' },
    ],
  },
]
